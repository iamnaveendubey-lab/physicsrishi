"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  getChapters, 
  getChapterProgress, 
  updateChapterProgressFields, 
  PhysicsChapter, 
  ChapterProgress 
} from "@/lib/db";
import { CONCEPT_QUESTIONS, COMPETITION_QUESTIONS, MCQ } from "@/lib/quizData";

export default function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const chapterId = parseInt(resolvedParams.id, 10);
  const router = useRouter();
  const { user, refreshUserProfile } = useAuth();

  // Route fallback
  if (isNaN(chapterId)) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-physics-purple"></div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState("mindmap");
  const [chapter, setChapter] = useState<PhysicsChapter | null>(null);
  const [progress, setProgress] = useState<ChapterProgress | null>(null);
  const [loading, setLoading] = useState(true);

  // SECTION 1: MIND MAP STATES
  const [exploredNodes, setExploredNodes] = useState<string[]>([]);
  const [activeMindMapNode, setActiveMindMapNode] = useState<string | null>(null);

  // SECTION 2: CONCEPTS STATES
  const [readConcepts, setReadConcepts] = useState<string[]>([]);
  const [activeConceptModal, setActiveConceptModal] = useState<number | null>(null);

  // SECTION 3: FORMULA STATES
  const [learnedFormulas, setLearnedFormulas] = useState<string[]>([]);
  const [bookmarkedFormulas, setBookmarkedFormulas] = useState<string[]>([]);

  // SECTION 4: EXAMPLES STATES
  const [exampleExamTrack, setExampleExamTrack] = useState<"neet" | "jee">("jee");
  const [reviewedExamples, setReviewedExamples] = useState<number[]>([]); // holds example IDs (1-10)
  const [expandedExampleSolutions, setExpandedExampleSolutions] = useState<number[]>([]);

  // SECTION 5: CONCEPT TEST STATES
  const [conceptTestActive, setConceptTestActive] = useState(false);
  const [conceptCurrentIndex, setConceptCurrentIndex] = useState(0);
  const [conceptSelectedOption, setConceptSelectedOption] = useState<number | null>(null);
  const [conceptShowFeedback, setConceptShowFeedback] = useState(false);
  const [conceptAnswers, setConceptAnswers] = useState<boolean[]>([]); // tracks pass/fail per Q
  const [conceptTestFinished, setConceptTestFinished] = useState(false);

  // SECTION 6: COMPETITION TEST STATES
  const [compTestActive, setCompTestActive] = useState(false);
  const [compCurrentIndex, setCompCurrentIndex] = useState(0);
  const [compResponses, setCompResponses] = useState<Record<number, number>>({}); // maps question index -> option index
  const [compFlagged, setCompFlagged] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(3000); // 50 minutes = 3000 seconds
  const [compTestFinished, setCompTestFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch chapter parameters and user progress on mount
  useEffect(() => {
    if (!user) return;

    const loadWorkspace = async () => {
      setLoading(true);
      try {
        const list = await getChapters();
        const ch = list.find((c) => c.chapterId === chapterId);
        setChapter(ch || null);

        const prog = await getChapterProgress(user.uid, chapterId);
        setProgress(prog);
        
        // Retroactively populate completion caches if already done in Firestore
        if (prog.mindMapCompleted) setExploredNodes(["quantities", "fundamental", "derived", "units", "dimensions", "figures", "analysis"]);
        if (prog.conceptsCompleted) setReadConcepts(["quantities", "si", "fundamental", "derived", "dimensions", "figures", "error", "analysis"]);
        if (prog.formulaSheetCompleted) setLearnedFormulas(["formula_1", "formula_2", "formula_3", "formula_4"]);
        if (prog.examplesCompleted) setReviewedExamples([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      } catch (err) {
        console.error("Failed to load learning workspace:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWorkspace();
  }, [chapterId, user]);

  // Handle Competition Test countdown
  useEffect(() => {
    if (compTestActive && timeLeft > 0 && !compTestFinished) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (compTestActive && timeLeft === 0 && !compTestFinished) {
      handleCompleteCompTest();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [compTestActive, timeLeft, compTestFinished]);

  if (!user || loading || !chapter || !progress) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-physics-purple"></div>
      </div>
    );
  }

  // Study status flags
  const isNotesCompleted = progress.mindMapCompleted && progress.conceptsCompleted && progress.formulaSheetCompleted && progress.examplesCompleted;
  const isConceptTestPassed = progress.conceptTestScore >= 60;
  const isCompetitionTestPassed = progress.competitionTestScore >= 70;

  // Sync state changes with database
  const saveProgressChange = async (fields: Partial<ChapterProgress>) => {
    try {
      const updated = await updateChapterProgressFields(user.uid, chapterId, fields, user.currentChapter);
      setProgress(updated);
      await refreshUserProfile();
    } catch (err) {
      console.error("Database save failed:", err);
    }
  };

  // MIND MAP CONTROLS
  const mindMapNodes = [
    { id: "quantities", label: "Physical Quantities", x: "50%", y: "15%", details: "Any property of a material or phenomenon that can be measured and described numerically. Formulated as Q = n × u." },
    { id: "fundamental", label: "Fundamental Quantities", x: "20%", y: "30%", details: "Independent parameters representing the base units of SI. Includes Mass, Length, Time, Current, Temp, Luminous Intensity, and Mole." },
    { id: "derived", label: "Derived Quantities", x: "80%", y: "30%", details: "Quantities expressed by algebraically multiplying/dividing fundamental parameters. Example: Velocity, Force, Energy, Density." },
    { id: "units", label: "Units of Measure", x: "15%", y: "65%", details: "Standard parameters chosen as units. To convert systems: n₁u₁ = n₂u₂. Standard frameworks include SI, CGS, and MKS." },
    { id: "dimensions", label: "Dimensions", x: "85%", y: "65%", details: "Powers to which base SI parameters are raised to represent physical properties. Exponents represented inside brackets: [Mᵃ Lᵇ Tᶜ]." },
    { id: "figures", label: "Significant Figures", x: "35%", y: "85%", details: "Valid reliable digits in physical readings. Guided by decimal point locations, sandwich zeros, and scientific notation standards." },
    { id: "analysis", label: "Dimensional Analysis", x: "65%", y: "85%", details: "Applications of dimensional formulas to check mathematical homogeneity, convert units, and formulate physical equations." },
  ];

  const handleExploreNode = (id: string) => {
    setActiveMindMapNode(id);
    if (!exploredNodes.includes(id)) {
      const updated = [...exploredNodes, id];
      setExploredNodes(updated);
      if (updated.length === mindMapNodes.length) {
        saveProgressChange({ mindMapCompleted: true });
      }
    }
  };

  // CONCEPTS CONTROLS
  const conceptsList = [
    { title: "Physical Quantities", label: "quantities", overview: "Quantifying parameters of nature.", body: "Every physical quantity is expressed as Q = n × u. They must be measurable. Intangible traits like thoughts, feelings, or beauty are not physical quantities." },
    { title: "SI System of Units", label: "si", overview: "The global measurement standard.", body: "Adopted in 1971 by CGPM. System consists of 7 Base units, 2 Supplementary units (Radian and Steradian), and infinite derived combinations." },
    { title: "Fundamental Units", label: "fundamental", overview: "The independent baseline variables.", body: "Base units form the fundamental coordinates of measurements: Mass [kg], Length [m], Time [s], Current [A], Temp [K], Intensity [cd], and Substance [mol]." },
    { title: "Derived Units", label: "derived", overview: "Interlocked unit systems.", body: "units produced by scaling base parameters. For example: Acceleration (m/s²), Pressure (N/m² or Pa), and Charge (A·s or Coulomb)." },
    { title: "Dimensions & Formulas", label: "dimensions", overview: "Power index coordinates of metrics.", body: "Forces, energies, and fields mapped by powers. Example: Force = [MLT⁻²], work = [ML²T⁻²]. Dimensionless metrics include angles, strain, and relative density." },
    { title: "Significant Figures", label: "figures", overview: "Accuracy index of physical limits.", body: "Significant figures verify precision limits. Non-zero values and sandwich zeros are significant. Leading zeros are disregarded." },
    { title: "Error Analysis", label: "error", overview: "Uncertainty calculations.", body: "Absolute Error: Δa = |a_mean - a_i|. Fractional Error: Δa/a. Percentage Error: (Δa/a) × 100%. Addition/Subtraction error propagates as sum of absolute errors." },
    { title: "Dimensional Analysis", label: "analysis", overview: "Principal formulas verifier.", body: "Uses the Principle of Homogeneity: dimensions on LHS must equal RHS. Quantities of different dimensions cannot be added or subtracted." },
  ];

  const handleReadConcept = (label: string, idx: number) => {
    setActiveConceptModal(idx);
    if (!readConcepts.includes(label)) {
      const updated = [...readConcepts, label];
      setReadConcepts(updated);
      if (updated.length === conceptsList.length) {
        saveProgressChange({ conceptsCompleted: true });
      }
    }
  };

  // FORMULA CONTROLS
  const formulas = [
    { id: "formula_1", title: "Dimensional Formulas Reference", code: "[Force] = [MLT⁻²] \n[Energy] = [ML²T⁻²] \n[Planck's Constant] = [ML²T⁻¹] \n[Gravitational Constant G] = [M⁻¹L³T⁻²]" },
    { id: "formula_2", title: "Percentage Error Relations", code: "If P = aˣ bʸ / cᶻ \nMaximum Fractional Error:\nΔP/P = x(Δa/a) + y(Δb/b) + z(Δc/c)\nMaximum Percentage Error:\n(ΔP/P)% = x(Δa/a)% + y(Δb/b)% + z(Δc/c)%" },
    { id: "formula_3", title: "Significant Figures Rules", code: "1. All non-zero digits are significant.\n2. Zeros between non-zero digits are significant.\n3. Leading zeros are NEVER significant.\n4. Trailing zeros after decimal are significant." },
    { id: "formula_4", title: "Error Propagation Formulae", code: "Sum (Z = A + B) &rArr; ΔZ = ΔA + ΔB\nDifference (Z = A - B) &rArr; ΔZ = ΔA + ΔB\nProduct (Z = A × B) &rArr; ΔZ/Z = ΔA/A + ΔB/B\nQuotient (Z = A / B) &rArr; ΔZ/Z = ΔA/A + ΔB/B" },
  ];

  const handleToggleLearnFormula = (id: string) => {
    let updated: string[];
    if (learnedFormulas.includes(id)) {
      updated = learnedFormulas.filter((f) => f !== id);
    } else {
      updated = [...learnedFormulas, id];
    }
    setLearnedFormulas(updated);
    if (updated.length === formulas.length) {
      saveProgressChange({ formulaSheetCompleted: true });
    }
  };

  const handleBookmarkFormula = (id: string) => {
    if (bookmarkedFormulas.includes(id)) {
      setBookmarkedFormulas(bookmarkedFormulas.filter((f) => f !== id));
    } else {
      setBookmarkedFormulas([...bookmarkedFormulas, id]);
    }
  };

  // SOLVED EXAMPLES DATA
  const solvedExamples = [
    {
      id: 1,
      exam: "neet",
      q: "A physical quantity is represented by Y = M^a L^b T^c. If the percentage errors in the measurement of M, L, and T are α%, β%, and γ% respectively, find the maximum percentage error in Y.",
      options: ["aα + bβ + cγ", "aα - bβ + cγ", "(aα + bβ + cγ) / 100", "None of these"],
      correct: "aα + bβ + cγ",
      sol: "Write relative error differential: ΔY/Y = a(ΔM/M) + b(ΔL/L) + c(ΔT/T). Multiply by 100: (ΔY/Y)% = a(α%) + b(β%) + c(γ%) = aα + bβ + cγ."
    },
    {
      id: 2,
      exam: "neet",
      q: "The percentage errors in the measurement of mass and speed are 2% and 3% respectively. What is the maximum error in kinetic energy calculated from these metrics?",
      options: ["5%", "8%", "11%", "1%"],
      correct: "8%",
      sol: "Kinetic Energy E = ½ m v². Maximum fractional error: ΔE/E = Δm/m + 2(Δv/v). In percentage form: % Error = 2% + 2 × (3%) = 8%."
    },
    {
      id: 3,
      exam: "neet",
      q: "Dimensions of resistance in terms of fundamental mechanical and charge coordinates is represented by:",
      options: ["[M L² T⁻¹ Q⁻²]", "[M L² T⁻² Q⁻²]", "[M L T⁻¹ Q⁻²]", "[M L² T Q⁻²]"],
      correct: "[M L² T⁻¹ Q⁻²]",
      sol: "Resistance R = V / I. Potential V = Work / Charge = [ML²T⁻²] / [Q] = [ML²T⁻²Q⁻¹]. Current I = Q/T = [QT⁻¹]. Therefore R = [ML²T⁻²Q⁻¹] / [QT⁻¹] = [M L² T⁻¹ Q⁻²]."
    },
    {
      id: 4,
      exam: "neet",
      q: "Find the significant figures count of 0.0003040.",
      options: ["7", "4", "3", "5"],
      correct: "4",
      sol: "Leading zeros (0.000) are not significant. 3 and 4 are significant. The zero between 3 and 4 is a sandwich zero, so it is significant. The trailing zero after decimal (0 after 4) is significant. Active digits: 3, 0, 4, 0 (4 significant figures)."
    },
    {
      id: 5,
      exam: "neet",
      q: "The density of a sphere is calculated as Mass/Volume. If error in mass is 1% and error in radius is 1.5%, error in density calculation is:",
      options: ["2.5%", "4%", "5.5%", "1.5%"],
      correct: "5.5%",
      sol: "Density ρ = M / (4/3 π r³) &rArr; Δρ/ρ = ΔM/M + 3 × (Δr/r). Percentage Error = 1% + 3(1.5%) = 5.5%."
    },
    {
      id: 6,
      exam: "jee",
      q: "Find the dimensions of a/b in the Van der Waals equation: (P + a/V²)(V - b) = RT, where P is pressure, V is volume, T is temperature.",
      options: ["[M L⁵ T⁻²]", "[M L² T⁻²]", "[M L⁻¹ T⁻²]", "[M L³ T⁻²]"],
      correct: "[M L⁵ T⁻²]",
      sol: "By Principle of Homogeneity, terms added must have identical dimensions. [a/V²] = [P] &rArr; [a] = [P][V²] = [ML⁻¹T⁻²][L³]² = [ML⁵T⁻²]. Also [b] = [V] = [L³]. So, [a/b] = [ML⁵T⁻²] / [L³] = [M L⁵ T⁻²]."
    },
    {
      id: 7,
      exam: "jee",
      q: "A student measures diameter of wire using screw gauge of least count 0.001 cm. The reading is 5.320 mm. What is the fractional error in calculation?",
      options: ["0.00188", "0.0188", "0.00018", "0.188"],
      correct: "0.00188",
      sol: "Least count (error margin) Δd = 0.001 cm = 0.01 mm. Measured value d = 5.320 mm. Fractional Error = Δd/d = 0.01 / 5.320 ≈ 0.00188."
    },
    {
      id: 8,
      exam: "jee",
      q: "If speed of light c, Planck's constant h, and gravitational constant G are taken as fundamental base variables, time is dimensionally mapped as:",
      options: ["√(hG/c⁵)", "hG/c³", "√(hc⁵/G)", "√(hG/c³)"],
      correct: "\u221a(hG/c\u2075)",
      sol: "Let T = c^x h^y G^z. Match dimensions: [T] = [LT⁻¹]^x [ML²T⁻¹]^y [M⁻¹L³T⁻²]^z. Solving indices: y - z = 0 &rArr; y=z. x + 2y + 3z = 0 &rArr; x = -5z. -x - y - 2z = 1 &rArr; z=½ &rArr; y=½, x=-5/2. So, T = c^(-5/2) h^(1/2) G^(1/2) = √(hG/c⁵)."
    },
    {
      id: 9,
      exam: "jee",
      q: "Vernier scale of calipers has 50 divisions coinciding with 49 divisions of main scale (MSD = 0.5 mm). Least count of calipers is:",
      options: ["0.01 mm", "0.02 mm", "0.05 mm", "0.1 mm"],
      correct: "0.01 mm",
      sol: "Least Count = 1 MSD - 1 VSD = 1 MSD - (49/50) MSD = 1/50 MSD = 0.5 mm / 50 = 0.01 mm."
    },
    {
      id: 10,
      exam: "jee",
      q: "If the force acting on a particle is given by F = at + bt² where t is time, dimensions of product ab are:",
      options: ["[M² L² T⁻⁷]", "[M L² T⁻⁶]", "[M² L T⁻⁶]", "[M L T⁻⁵]"],
      correct: "[M\u00B2 L\u00B2 T\u207B\u2077]",
      sol: "[at] = [F] &rArr; [a] = [MLT⁻³]. [bt²] = [F] &rArr; [b] = [MLT⁻⁴]. Product [ab] = [MLT⁻³][MLT⁻⁴] = [M² L² T⁻⁷]."
    }
  ];

  const handleReviewExample = (id: number) => {
    if (!reviewedExamples.includes(id)) {
      const updated = [...reviewedExamples, id];
      setReviewedExamples(updated);
      if (updated.length === solvedExamples.length) {
        saveProgressChange({ examplesCompleted: true });
      }
    }
  };

  const handleToggleSolution = (id: number) => {
    if (expandedExampleSolutions.includes(id)) {
      setExpandedExampleSolutions(expandedExampleSolutions.filter((x) => x !== id));
    } else {
      setExpandedExampleSolutions([...expandedExampleSolutions, id]);
      handleReviewExample(id); // Automate review confirmation when solution is viewed
    }
  };

  // CONCEPT TEST CONTROLS
  const startConceptTest = () => {
    setConceptTestActive(true);
    setConceptCurrentIndex(0);
    setConceptSelectedOption(null);
    setConceptShowFeedback(false);
    setConceptAnswers([]);
    setConceptTestFinished(false);
  };

  const handleConceptSubmitOption = () => {
    if (conceptSelectedOption === null) return;
    const q = CONCEPT_QUESTIONS[conceptCurrentIndex];
    const correct = conceptSelectedOption === q.correctIndex;
    
    setConceptAnswers([...conceptAnswers, correct]);
    setConceptShowFeedback(true);
  };

  const handleConceptNext = () => {
    if (conceptCurrentIndex < CONCEPT_QUESTIONS.length - 1) {
      setConceptCurrentIndex(conceptCurrentIndex + 1);
      setConceptSelectedOption(null);
      setConceptShowFeedback(false);
    } else {
      // Finished
      const correctCount = conceptAnswers.filter(Boolean).length;
      const scorePercentage = Math.round((correctCount / CONCEPT_QUESTIONS.length) * 100);
      
      saveProgressChange({ conceptTestScore: scorePercentage });
      setConceptTestFinished(true);
    }
  };

  // COMPETITION TEST CONTROLS
  const startCompTest = () => {
    setCompTestActive(true);
    setCompCurrentIndex(0);
    setCompResponses({});
    setCompFlagged([]);
    setTimeLeft(3000);
    setCompTestFinished(false);
  };

  const handleSelectCompOption = (optIdx: number) => {
    setCompResponses({
      ...compResponses,
      [compCurrentIndex]: optIdx,
    });
  };

  const handleToggleFlag = (idx: number) => {
    if (compFlagged.includes(idx)) {
      setCompFlagged(compFlagged.filter((f) => f !== idx));
    } else {
      setCompFlagged([...compFlagged, idx]);
    }
  };

  const handleCompleteCompTest = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSubmitting(true);

    let correctCount = 0;
    COMPETITION_QUESTIONS.forEach((q, idx) => {
      if (compResponses[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / COMPETITION_QUESTIONS.length) * 100);
    
    await saveProgressChange({ 
      competitionTestScore: scorePercentage 
    });
    
    setCompTestFinished(true);
    setSubmitting(false);
  };

  const getFormatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative overflow-hidden bg-dark-bg min-h-screen py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 physics-grid opacity-15 pointer-events-none"></div>
      <div className="absolute top-[10%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-physics-purple/5 blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-dark-border/20 pb-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-semibold tracking-wide">
            <Link href="/dashboard" className="hover:text-white transition-colors">Physics</Link>
            <span>&rarr;</span>
            <span className="text-slate-400">Class 11</span>
            <span>&rarr;</span>
            <span className="text-white font-bold">{chapter.title}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full ${
              progress.chapterCompleted 
                ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/25 animate-pulse" 
                : "bg-white/5 border border-dark-border/40 text-slate-400"
            }`}>
              {progress.chapterCompleted ? "Chapter Mastered" : "Active Syllabus Track"}
            </span>
          </div>
        </div>

        {/* Course Progress Indicators Panel */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-10">
          {[
            { label: "Mind Map", active: progress.mindMapCompleted, color: "border-physics-purple text-physics-purple" },
            { label: "Concepts", active: progress.conceptsCompleted, color: "border-physics-blue text-physics-blue" },
            { label: "Formulae", active: progress.formulaSheetCompleted, color: "border-neet text-neet" },
            { label: "Examples", active: progress.examplesCompleted, color: "border-jee text-jee" },
            { label: `Concept Test: ${progress.conceptTestScore}%`, active: isConceptTestPassed, color: "border-physics-purple text-physics-purple-300" },
            { label: `Comp Test: ${progress.competitionTestScore}%`, active: isCompetitionTestPassed, color: "border-physics-blue text-physics-blue-300" },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                item.active 
                  ? `bg-white/5 border-l-4 ${item.color}` 
                  : "bg-dark-bg/40 border-dark-border/30 text-slate-600 opacity-60"
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                {item.active ? (
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700 shrink-0"></div>
                )}
                <span>{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Selection Row */}
        <div className="flex border-b border-dark-border/40 overflow-x-auto gap-2 mb-8 no-scrollbar scroll-smooth">
          {[
            { id: "mindmap", label: "1. Mind Map" },
            { id: "concepts", label: "2. Concepts" },
            { id: "formulas", label: "3. Formulas" },
            { id: "examples", label: "4. Examples" },
            { id: "concepttest", label: "5. Concept Test" },
            { id: "comptest", label: "6. Competition Test" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 border-b-2 font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "border-physics-purple text-white bg-physics-purple/5"
                  : "border-transparent text-slate-500 hover:text-slate-350 hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: MIND MAP VIEW */}
        {activeTab === "mindmap" && (
          <div className="space-y-8">
            <div className="text-left max-w-3xl">
              <h2 className="font-display font-extrabold text-2xl text-white mb-2">Interactive Syllabus Mind Map</h2>
              <p className="text-slate-400 text-sm">
                Explore the interconnected branches of Chapter 1. Click each node bubble to study its core equations and definitions. Exploring all 7 branches unlocks note validation.
              </p>
              <div className="mt-3 text-xs font-semibold text-physics-purple">
                Nodes Explored: {exploredNodes.length} of {mindMapNodes.length}
              </div>
            </div>

            {/* Mindmap Interactive Graph Block */}
            <div className="relative w-full h-[500px] border border-dark-border/30 rounded-3xl bg-dark-bg/30 overflow-hidden flex items-center justify-center p-4">
              {/* Radial background grids */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-96 h-96 rounded-full border border-dark-border/10"></div>
                <div className="w-[500px] h-[500px] rounded-full border border-dark-border/5"></div>
              </div>

              {/* Center Core Node */}
              <div className="z-10 px-6 py-4 rounded-2xl bg-gradient-to-r from-physics-purple to-physics-blue border border-white/20 shadow-lg text-center select-none physics-glow-purple">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Chapter 1 Core</span>
                <h4 className="font-display font-black text-white text-base">Units & Measurements</h4>
              </div>

              {/* Connected surrounding Nodes */}
              {mindMapNodes.map((node) => {
                const isExplored = exploredNodes.includes(node.id);
                return (
                  <button
                    key={node.id}
                    onClick={() => handleExploreNode(node.id)}
                    style={{ position: "absolute", left: node.x, top: node.y, transform: "translate(-50%, -50%)" }}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-semibold shadow-md transition-all duration-300 ${
                      isExplored
                        ? "bg-white/5 border-physics-purple text-white"
                        : "bg-dark-bg/60 border-dark-border/50 text-slate-450 hover:border-physics-purple/60 hover:text-white"
                    } ${activeMindMapNode === node.id ? "ring-2 ring-physics-purple/50 scale-105" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isExplored ? "bg-physics-purple" : "bg-slate-700"}`}></span>
                      <span>{node.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Node Details Box */}
            {activeMindMapNode && (
              <div className="p-6 rounded-3xl glassmorphism border border-physics-purple/30 bg-dark-bg/40 animate-float">
                <h4 className="font-display font-extrabold text-white text-base mb-2">
                  {mindMapNodes.find((n) => n.id === activeMindMapNode)?.label}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {mindMapNodes.find((n) => n.id === activeMindMapNode)?.details}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CONCEPTS CARD GRID */}
        {activeTab === "concepts" && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-left">
              <h2 className="font-display font-extrabold text-2xl text-white mb-2">Syllabus Concepts Deck</h2>
              <p className="text-slate-400 text-sm">
                Unlock conceptual cards covering the complete Units and Measurements guidelines. Click cards to view comprehensive definitions and log your review status.
              </p>
              <div className="mt-3 text-xs font-semibold text-physics-blue">
                Topics Studied: {readConcepts.length} of {conceptsList.length}
              </div>
            </div>

            {/* Concept Deck Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {conceptsList.map((concept, idx) => {
                const isRead = readConcepts.includes(concept.label);
                return (
                  <button
                    key={concept.label}
                    onClick={() => handleReadConcept(concept.label, idx)}
                    className={`text-left p-5 rounded-2xl glassmorphism glassmorphism-hover border transition-all ${
                      isRead 
                        ? "border-physics-blue bg-physics-blue/5 text-white" 
                        : "border-dark-border/40 text-slate-400 hover:border-physics-blue/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-physics-blue">Concept {idx + 1}</span>
                      {isRead && (
                        <span className="px-2 py-0.5 rounded bg-physics-blue/20 text-[9px] font-bold text-physics-blue-300">Reviewed</span>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-base mb-1">{concept.title}</h4>
                    <p className="text-xs text-slate-500 leading-normal">{concept.overview}</p>
                  </button>
                );
              })}
            </div>

            {/* Concept Detailed Content Modal */}
            {activeConceptModal !== null && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="w-full max-w-xl rounded-3xl glassmorphism border border-physics-blue/30 bg-[#0d0720] shadow-2xl overflow-hidden p-6 sm:p-8 animate-float">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold text-physics-blue uppercase tracking-widest">Physics Concepts &bull; Chapter 1</span>
                    <button
                      onClick={() => setActiveConceptModal(null)}
                      className="text-slate-450 hover:text-white p-1"
                    >
                      ✕ Close
                    </button>
                  </div>
                  <h3 className="font-display font-black text-white text-xl sm:text-2xl mb-4">
                    {conceptsList[activeConceptModal].title}
                  </h3>
                  <p className="text-slate-350 text-sm sm:text-base leading-relaxed mb-6">
                    {conceptsList[activeConceptModal].body}
                  </p>
                  <button
                    onClick={() => setActiveConceptModal(null)}
                    className="w-full py-3 bg-physics-blue text-white font-bold rounded-xl text-sm transition-all"
                  >
                    Continue Study
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FORMULA CHEATSHEETS */}
        {activeTab === "formulas" && (
          <div className="space-y-8">
            <div className="text-left">
              <h2 className="font-display font-extrabold text-2xl text-white mb-2">High-Yield Formula Sheet</h2>
              <p className="text-slate-400 text-sm">
                Master essential conversions and error propagation formulas. Click checkmarks to flag formulas as learned and bookmark star icons for high-priority revisions.
              </p>
              <div className="mt-3 text-xs font-semibold text-neet">
                Formulas Memorized: {learnedFormulas.length} of {formulas.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formulas.map((form) => {
                const isLearned = learnedFormulas.includes(form.id);
                const isBookmarked = bookmarkedFormulas.includes(form.id);
                return (
                  <div 
                    key={form.id}
                    className={`p-6 rounded-3xl border glassmorphism transition-all flex flex-col justify-between ${
                      isLearned 
                        ? "border-neet bg-emerald-500/5" 
                        : "border-dark-border/40"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-4 border-b border-dark-border/20 pb-3">
                        <h4 className="font-bold text-white text-sm sm:text-base">{form.title}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBookmarkFormula(form.id)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isBookmarked 
                                ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500" 
                                : "border-dark-border/50 text-slate-500 hover:text-white"
                            }`}
                          >
                            ★
                          </button>
                        </div>
                      </div>
                      
                      <pre className="font-mono text-xs sm:text-sm text-slate-350 leading-relaxed bg-black/35 p-4 rounded-xl border border-dark-border/30 overflow-x-auto whitespace-pre-wrap">
                        {form.code}
                      </pre>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => handleToggleLearnFormula(form.id)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider border transition-all ${
                          isLearned
                            ? "bg-neet/10 border-neet/30 text-neet"
                            : "border-dark-border/60 text-slate-400 hover:border-neet hover:text-white"
                        }`}
                      >
                        {isLearned ? "✓ Learned" : "Mark as Learned"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SOLVED EXAMPLES PAGE */}
        {activeTab === "examples" && (
          <div className="space-y-8">
            <div className="text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-white mb-2">Solved Example Index</h2>
                <p className="text-slate-400 text-sm">
                  Review complete step-by-step solutions for 5 NEET and 5 JEE Main examples to build conceptual fluency.
                </p>
                <div className="mt-3 text-xs font-semibold text-jee">
                  Examples Reviewed: {reviewedExamples.length} of {solvedExamples.length}
                </div>
              </div>

              {/* NEET/JEE track selector */}
              <div className="flex p-1 bg-white/5 border border-dark-border/40 rounded-xl">
                <button
                  onClick={() => setExampleExamTrack("jee")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    exampleExamTrack === "jee" ? "bg-jee text-white" : "text-slate-500 hover:text-white"
                  }`}
                >
                  JEE Main (5)
                </button>
                <button
                  onClick={() => setExampleExamTrack("neet")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    exampleExamTrack === "neet" ? "bg-neet text-white" : "text-slate-500 hover:text-white"
                  }`}
                >
                  NEET Medical (5)
                </button>
              </div>
            </div>

            {/* Solved Examples list */}
            <div className="space-y-4">
              {solvedExamples
                .filter((ex) => ex.exam === exampleExamTrack)
                .map((ex) => {
                  const isReviewed = reviewedExamples.includes(ex.id);
                  const isExpanded = expandedExampleSolutions.includes(ex.id);
                  return (
                    <div 
                      key={ex.id}
                      className={`p-6 rounded-3xl border glassmorphism transition-all ${
                        isReviewed ? "border-jee/20" : "border-dark-border/40"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <span className="text-xs font-bold text-jee uppercase tracking-widest">Example {ex.id}</span>
                        {isReviewed && (
                          <span className="px-3 py-1 rounded bg-jee/10 border border-jee/20 text-[10px] font-bold text-jee">Reviewed</span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-base leading-relaxed mb-4">{ex.q}</h4>

                      {/* Options checklist */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {ex.options.map((opt, idx) => (
                          <div 
                            key={idx}
                            className={`p-3.5 rounded-xl border text-sm font-semibold select-none ${
                              opt === ex.correct 
                                ? "bg-emerald-500/5 border-emerald-500/25 text-emerald-450 font-bold" 
                                : "bg-black/15 border-dark-border/20 text-slate-500"
                            }`}
                          >
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>

                      {/* Solved details drop */}
                      <button
                        onClick={() => handleToggleSolution(ex.id)}
                        className="px-5 py-2.5 bg-white/5 border border-dark-border/40 text-xs font-bold rounded-xl text-slate-350 hover:text-white transition-all flex items-center gap-1.5"
                      >
                        <span>{isExpanded ? "Hide Steps" : "Show Step-by-Step Solution"}</span>
                        <span>{isExpanded ? "▲" : "▼"}</span>
                      </button>

                      {isExpanded && (
                        <div className="mt-4 p-5 bg-black/45 border border-dark-border/30 rounded-2xl text-sm leading-relaxed text-slate-350 animate-fade-in font-sans">
                          <span className="text-[10px] font-bold text-jee uppercase tracking-widest block mb-2">Step-by-Step Explanation</span>
                          {ex.sol}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 5: CONCEPT TEST */}
        {activeTab === "concepttest" && (
          <div className="space-y-8">
            <div className="text-left max-w-3xl mb-8">
              <h2 className="font-display font-extrabold text-2xl text-white mb-2">Concept Test Assessment</h2>
              <p className="text-slate-400 text-sm">
                Submit response answers to 15 conceptual multiple-choice questions. Score at least 60% (9 correct answers) to pass the exam track and unlock the Competition test.
              </p>
              
              {progress.conceptTestScore > 0 && (
                <div className="mt-3 flex gap-4">
                  <span className={`text-xs font-bold ${isConceptTestPassed ? "text-emerald-450" : "text-red-400"}`}>
                    Highest Score: {progress.conceptTestScore}% ({isConceptTestPassed ? "Passed" : "Failed"})
                  </span>
                </div>
              )}
            </div>

            {/* Test Access Guard */}
            {!isNotesCompleted ? (
              <div className="p-8 rounded-3xl glassmorphism border border-dark-border bg-dark-bg/80 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-dark-border/50 flex items-center justify-center text-slate-500 mb-4 animate-pulse">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-display font-extrabold text-white text-lg mb-2">Concept Test is Locked</h3>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md">
                  Please complete all previous chapter study tabs: **Mind Map**, **Concepts review**, **Formulas checklist**, and **Solved Examples** to unlock the Concept Test.
                </p>
              </div>
            ) : !conceptTestActive ? (
              // Quiz Start Screen
              <div className="p-8 rounded-3xl glassmorphism border border-dark-border text-center flex flex-col items-center justify-center min-h-[300px]">
                <h3 className="font-display font-extrabold text-white text-xl mb-4">Start 15 Qs Concept Test</h3>
                <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
                  Solve 15 physics MCQs one-by-one with instant results feedback and structural explanations.
                </p>
                <button
                  onClick={startConceptTest}
                  className="px-8 py-3.5 bg-gradient-to-r from-physics-purple to-physics-blue text-white font-bold rounded-xl text-sm transition-all"
                >
                  Start Assessment
                </button>
              </div>
            ) : conceptTestFinished ? (
              // Quiz Result Screen
              <div className="p-8 rounded-3xl glassmorphism border border-dark-border text-center flex flex-col items-center justify-center min-h-[300px]">
                <h3 className="font-display font-black text-white text-2xl mb-2">Test Finished!</h3>
                <p className="text-slate-400 text-sm mb-6">
                  You scored <span className="text-white font-bold">{conceptAnswers.filter(Boolean).length} / 15</span> ({Math.round((conceptAnswers.filter(Boolean).length / 15) * 100)}%)
                </p>
                
                {Math.round((conceptAnswers.filter(Boolean).length / 15) * 100) >= 60 ? (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-450 text-sm font-semibold max-w-md">
                    ★ PASSED! Level 1 Concept Test cleared successfully. Competition Test is now unlocked.
                  </div>
                ) : (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold max-w-md">
                    ✕ FAILED. Score at least 60% (9 correct answers) to pass and unlock the Competition Test.
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={startConceptTest}
                    className="px-6 py-3 bg-physics-purple hover:brightness-110 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Retake Test
                  </button>
                  <button
                    onClick={() => {
                      setConceptTestActive(false);
                      setConceptTestFinished(false);
                    }}
                    className="px-6 py-3 bg-white/5 border border-dark-border text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Exit Workspace
                  </button>
                </div>
              </div>
            ) : (
              // Active Quiz Screen
              <div className="glassmorphism rounded-3xl p-6 sm:p-8 border border-dark-border">
                <div className="flex justify-between items-center mb-6 border-b border-dark-border/20 pb-3">
                  <span className="text-xs font-bold text-physics-purple uppercase tracking-widest">Active Question {conceptCurrentIndex + 1} of 15</span>
                  <span className="text-xs text-slate-400 font-bold">
                    Score: {conceptAnswers.filter(Boolean).length}
                  </span>
                </div>

                <p className="text-white font-bold text-base sm:text-lg mb-6 leading-relaxed">
                  {CONCEPT_QUESTIONS[conceptCurrentIndex].question}
                </p>

                <div className="space-y-3 mb-6">
                  {CONCEPT_QUESTIONS[conceptCurrentIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => !conceptShowFeedback && setConceptSelectedOption(idx)}
                      disabled={conceptShowFeedback}
                      className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all ${
                        conceptSelectedOption === idx
                          ? "bg-physics-purple/15 border-physics-purple text-white"
                          : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white"
                      } ${conceptShowFeedback ? "opacity-75 cursor-not-allowed" : ""}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {conceptShowFeedback && (
                  <div className={`p-5 rounded-2xl border mb-6 text-sm leading-relaxed ${
                    conceptSelectedOption === CONCEPT_QUESTIONS[conceptCurrentIndex].correctIndex
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-450"
                      : "bg-red-500/10 border-red-500/30 text-red-405"
                  }`}>
                    <h4 className="font-bold mb-2">
                      {conceptSelectedOption === CONCEPT_QUESTIONS[conceptCurrentIndex].correctIndex 
                        ? "✓ Correct Answer" 
                        : `✕ Incorrect. Correct answer is option ${CONCEPT_QUESTIONS[conceptCurrentIndex].correctIndex + 1}`}
                    </h4>
                    {CONCEPT_QUESTIONS[conceptCurrentIndex].explanation}
                  </div>
                )}

                <div className="flex gap-4">
                  {!conceptShowFeedback ? (
                    <button
                      onClick={handleConceptSubmitOption}
                      disabled={conceptSelectedOption === null}
                      className="px-6 py-3.5 bg-physics-purple disabled:opacity-50 text-white font-bold text-xs tracking-wider rounded-xl transition-all"
                    >
                      Verify Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleConceptNext}
                      className="px-6 py-3.5 bg-physics-purple text-white font-bold text-xs tracking-wider rounded-xl transition-all"
                    >
                      {conceptCurrentIndex < CONCEPT_QUESTIONS.length - 1 ? "Next Question &rarr;" : "Finish Test"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: COMPETITION TEST */}
        {activeTab === "comptest" && (
          <div className="space-y-8">
            <div className="text-left max-w-3xl mb-8">
              <h2 className="font-display font-extrabold text-2xl text-white mb-2">JEE/NEET Competition Test</h2>
              <p className="text-slate-400 text-sm">
                Enter simulated exam mode. Answer 50 MCQs under a 50-minute timer. Submissions will receive accuracy metrics. Score at least 70% (35 correct answers) to pass.
              </p>
              
              {progress.competitionTestScore > 0 && (
                <div className="mt-3 flex gap-4">
                  <span className={`text-xs font-bold ${isCompetitionTestPassed ? "text-emerald-450" : "text-red-400"}`}>
                    Highest Score: {progress.competitionTestScore}% ({isCompetitionTestPassed ? "Passed" : "Failed"})
                  </span>
                </div>
              )}
            </div>

            {/* Test Access Guard */}
            {!isConceptTestPassed ? (
              <div className="p-8 rounded-3xl glassmorphism border border-dark-border bg-dark-bg/80 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-dark-border/50 flex items-center justify-center text-slate-500 mb-4 animate-pulse">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-display font-extrabold text-white text-lg mb-2">Competition Test is Locked</h3>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md">
                  Please pass the **Concept Test** with a score of at least 60% to unlock the Competition Test.
                </p>
              </div>
            ) : !compTestActive ? (
              // Start Exam Screen
              <div className="p-8 rounded-3xl glassmorphism border border-dark-border text-center flex flex-col items-center justify-center min-h-[300px]">
                <h3 className="font-display font-extrabold text-white text-xl mb-4">Start 50 Qs Competition Test</h3>
                <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
                  Time Limit: 50 minutes. Instant feedback is hidden. Submit at the end to check accuracy and time diagnostics.
                </p>
                <button
                  onClick={startCompTest}
                  className="px-8 py-3.5 bg-gradient-to-r from-physics-purple to-physics-blue text-white font-bold rounded-xl text-sm transition-all"
                >
                  Enter Exam Mode
                </button>
              </div>
            ) : compTestFinished ? (
              // Results Analytics Screen
              <div className="glassmorphism rounded-3xl p-6 sm:p-8 border border-dark-border">
                <h3 className="font-display font-black text-white text-2xl text-center mb-6">Exam Analytics Report</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-center">
                  <div className="p-5 rounded-2xl bg-white/5 border border-dark-border/40">
                    <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Accuracy Score</span>
                    <p className="text-2xl font-black text-white mt-1">{progress.competitionTestScore}%</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 border border-dark-border/40">
                    <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Correct Answers</span>
                    <p className="text-2xl font-black text-emerald-450 mt-1">
                      {COMPETITION_QUESTIONS.filter((q, idx) => compResponses[idx] === q.correctIndex).length} / 50
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 border border-dark-border/40">
                    <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Time Taken</span>
                    <p className="text-2xl font-black text-physics-blue mt-1">{getFormatTime(3000 - timeLeft)}</p>
                  </div>
                </div>

                <div className="flex justify-center mb-8">
                  {progress.competitionTestScore >= 70 ? (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-450 text-sm font-semibold text-center">
                      ★ CONGRATULATIONS! You have successfully passed the Competition Test and unlocked Chapter 2.
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold text-center">
                      ✕ FAILED. You scored below 70%. Retake the test to satisfy the unlocking criteria.
                    </div>
                  )}
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={startCompTest}
                    className="px-6 py-3 bg-physics-purple hover:brightness-110 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Retake Test
                  </button>
                  <button
                    onClick={() => {
                      setCompTestActive(false);
                      setCompTestFinished(false);
                    }}
                    className="px-6 py-3 bg-white/5 border border-dark-border text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Exit Workspace
                  </button>
                </div>
              </div>
            ) : (
              // Active Timed Exam Screen
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left side questions panel */}
                <div className="lg:col-span-3 glassmorphism rounded-3xl p-6 border border-dark-border flex flex-col justify-between min-h-[400px]">
                  <div>
                    <div className="flex justify-between items-center mb-6 border-b border-dark-border/20 pb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question {compCurrentIndex + 1} of 50</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleFlag(compCurrentIndex)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                            compFlagged.includes(compCurrentIndex)
                              ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500"
                              : "border-dark-border/60 text-slate-500 hover:text-white"
                          }`}
                        >
                          ⚑ Mark Review
                        </button>
                      </div>
                    </div>

                    <p className="text-white font-bold text-sm sm:text-base mb-6 leading-relaxed">
                      {COMPETITION_QUESTIONS[compCurrentIndex].question}
                    </p>

                    <div className="space-y-3 mb-6">
                      {COMPETITION_QUESTIONS[compCurrentIndex].options.map((opt, idx) => {
                        const isSelected = compResponses[compCurrentIndex] === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectCompOption(idx)}
                            className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all ${
                              isSelected
                                ? "bg-physics-blue/15 border-physics-blue text-white"
                                : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCompCurrentIndex(Math.max(0, compCurrentIndex - 1))}
                      disabled={compCurrentIndex === 0}
                      className="px-5 py-2.5 bg-white/5 border border-dark-border text-white text-xs font-bold rounded-lg disabled:opacity-40"
                    >
                      &larr; Prev
                    </button>
                    <button
                      onClick={() => setCompCurrentIndex(Math.min(COMPETITION_QUESTIONS.length - 1, compCurrentIndex + 1))}
                      disabled={compCurrentIndex === COMPETITION_QUESTIONS.length - 1}
                      className="px-5 py-2.5 bg-white/5 border border-dark-border text-white text-xs font-bold rounded-lg disabled:opacity-40"
                    >
                      Next &rarr;
                    </button>
                  </div>
                </div>

                {/* Right side exam tracker sidebar */}
                <div className="glassmorphism rounded-3xl p-5 border border-dark-border space-y-6">
                  {/* Timer display */}
                  <div className="text-center p-4 bg-black/45 border border-dark-border/40 rounded-2xl">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Time Remaining</span>
                    <span className={`text-2xl font-black font-mono ${timeLeft < 300 ? "text-red-500 animate-pulse" : "text-white"}`}>
                      {getFormatTime(timeLeft)}
                    </span>
                  </div>

                  {/* Grid tracking 50 Qs */}
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-3">Question Navigator</span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {COMPETITION_QUESTIONS.map((_, idx) => {
                        const isAnswered = compResponses[idx] !== undefined;
                        const isFlagged = compFlagged.includes(idx);
                        return (
                          <button
                            key={idx}
                            onClick={() => setCompCurrentIndex(idx)}
                            className={`h-8 rounded-lg text-xs font-bold border transition-all flex items-center justify-center ${
                              compCurrentIndex === idx
                                ? "bg-physics-purple border-physics-purple text-white ring-2 ring-physics-purple/30"
                                : isFlagged
                                ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500"
                                : isAnswered
                                ? "bg-physics-blue/10 border-physics-blue/30 text-physics-blue-300"
                                : "bg-dark-bg/60 border-dark-border/40 text-slate-500"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Complete exam action */}
                  <button
                    onClick={handleCompleteCompTest}
                    disabled={submitting}
                    className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl text-xs tracking-wider transition-all disabled:opacity-50"
                  >
                    Submit Examination
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
