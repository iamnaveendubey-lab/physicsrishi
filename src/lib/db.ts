import { 
  collection, 
  getDocs, 
  setDoc, 
  getDoc,
  doc, 
  query, 
  where, 
  updateDoc 
} from "firebase/firestore";
import { db, isMockFirebase } from "./firebase";
import { getRegistryDbRecords, getChapterMeta } from "@/data/chapters/registry";
import type { ClassLevel } from "@/types/chapter";

export interface PhysicsChapter {
  chapterId: number;
  title: string;
  order: number;
  classLevel: ClassLevel;
  classOrder: number;
  slug: string;
}

export interface ChapterProgress {
  uid: string;
  chapterId: number;
  mindMapCompleted: boolean;
  conceptsCompleted: boolean;
  formulaSheetCompleted: boolean;
  examplesCompleted: boolean;
  conceptTestScore: number;      // 0 - 100 percentage
  competitionTestScore: number;  // 0 - 100 percentage
  chapterCompleted: boolean;
}

const DEFAULT_CHAPTERS: PhysicsChapter[] = getRegistryDbRecords();

function enrichChapterFromRegistry(ch: PhysicsChapter): PhysicsChapter {
  const meta = getChapterMeta(ch.chapterId);
  if (!meta) return ch;
  return {
    chapterId: meta.globalId,
    title: meta.title,
    order: meta.globalId,
    classLevel: meta.classLevel,
    classOrder: meta.classOrder,
    slug: meta.slug,
  };
}

/**
 * Seeds default chapters if the physicsChapters database is empty.
 */
export async function seedChaptersIfEmpty(): Promise<void> {
  if (isMockFirebase) {
    const stored = localStorage.getItem("physicsrishi_mock_chapters");
    if (!stored) {
      localStorage.setItem("physicsrishi_mock_chapters", JSON.stringify(DEFAULT_CHAPTERS));
    }
    return;
  }

  if (!db) return;

  try {
    const chaptersRef = collection(db, "physicsChapters");
    const snapshot = await getDocs(chaptersRef);
    
    if (snapshot.empty) {
      console.log("Physicsrishi: Seeding default physics chapters into Cloud Firestore...");
      for (const ch of DEFAULT_CHAPTERS) {
        await setDoc(doc(db, "physicsChapters", `chapter_${ch.chapterId}`), ch);
      }
    }
  } catch (err) {
    console.error("Failed to seed chapters in Firestore:", err);
  }
}

/**
 * Retrieves the complete list of chapters sorted by order.
 */
export async function getChapters(): Promise<PhysicsChapter[]> {
  if (isMockFirebase) {
    const stored = localStorage.getItem("physicsrishi_mock_chapters");
    const parsed: PhysicsChapter[] = stored ? JSON.parse(stored) : DEFAULT_CHAPTERS;
    return parsed.map(enrichChapterFromRegistry).sort((a, b) => a.order - b.order);
  }

  if (!db) return [];

  try {
    const snapshot = await getDocs(collection(db, "physicsChapters"));
    const list: PhysicsChapter[] = [];
    snapshot.forEach((d) => {
      list.push(enrichChapterFromRegistry(d.data() as PhysicsChapter));
    });
    return list.sort((a, b) => a.order - b.order);
  } catch (err) {
    console.error("Error fetching chapters:", err);
    return DEFAULT_CHAPTERS;
  }
}

/**
 * Retrieves progress metrics for a given user and chapter.
 */
export async function getChapterProgress(uid: string, chapterId: number): Promise<ChapterProgress> {
  const defaultProgress: ChapterProgress = {
    uid,
    chapterId,
    mindMapCompleted: false,
    conceptsCompleted: false,
    formulaSheetCompleted: false,
    examplesCompleted: false,
    conceptTestScore: 0,
    competitionTestScore: 0,
    chapterCompleted: false,
  };

  if (isMockFirebase) {
    const stored = localStorage.getItem("physicsrishi_mock_chapter_progress");
    const list: ChapterProgress[] = stored ? JSON.parse(stored) : [];
    const match = list.find((p) => p.uid === uid && p.chapterId === chapterId);
    return match || defaultProgress;
  }

  if (!db) return defaultProgress;

  try {
    const docRef = doc(db, "chapterProgress", `${uid}_${chapterId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as ChapterProgress;
    }
    return defaultProgress;
  } catch (err) {
    console.error("Error loading chapter progress:", err);
    return defaultProgress;
  }
}

/**
 * Retrieves all chapter progress records for a user to calculate dashboard statistics.
 */
export async function getAllUserChapterProgress(uid: string): Promise<ChapterProgress[]> {
  if (isMockFirebase) {
    const stored = localStorage.getItem("physicsrishi_mock_chapter_progress");
    const list: ChapterProgress[] = stored ? JSON.parse(stored) : [];
    return list.filter((p) => p.uid === uid);
  }

  if (!db) return [];

  try {
    const q = query(collection(db, "chapterProgress"), where("uid", "==", uid));
    const snapshot = await getDocs(q);
    const list: ChapterProgress[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as ChapterProgress);
    });
    return list;
  } catch (err) {
    console.error("Error fetching all user progress:", err);
    return [];
  }
}

/**
 * Updates dynamic keys in a user's chapterProgress document and tests for completion.
 * Unlocks the next chapter if criteria are satisfied.
 */
export async function updateChapterProgressFields(
  uid: string,
  chapterId: number,
  fields: Partial<ChapterProgress>,
  currentUserChapter?: number
): Promise<ChapterProgress> {
  const defaultProgress: ChapterProgress = {
    uid,
    chapterId,
    mindMapCompleted: false,
    conceptsCompleted: false,
    formulaSheetCompleted: false,
    examplesCompleted: false,
    conceptTestScore: 0,
    competitionTestScore: 0,
    chapterCompleted: false,
  };

  let merged: ChapterProgress;

  if (isMockFirebase) {
    const stored = localStorage.getItem("physicsrishi_mock_chapter_progress");
    const list: ChapterProgress[] = stored ? JSON.parse(stored) : [];
    const idx = list.findIndex((p) => p.uid === uid && p.chapterId === chapterId);
    
    const existing = idx >= 0 ? list[idx] : defaultProgress;
    merged = {
      ...existing,
      ...fields,
      uid,
      chapterId,
    };

    // Unlocking Rule Check
    const wasCompleted = existing.chapterCompleted;
    const isCompletedNow = 
      merged.mindMapCompleted &&
      merged.conceptsCompleted &&
      merged.formulaSheetCompleted &&
      merged.examplesCompleted &&
      merged.conceptTestScore >= 60 &&
      merged.competitionTestScore >= 70;

    merged.chapterCompleted = isCompletedNow;

    if (idx >= 0) {
      list[idx] = merged;
    } else {
      list.push(merged);
    }
    localStorage.setItem("physicsrishi_mock_chapter_progress", JSON.stringify(list));

    // Auto-advance if meets criteria and on active chapter
    const nextChapter = chapterId + 1;
    const isAdvancing = !wasCompleted && isCompletedNow && currentUserChapter === chapterId;

    if (isAdvancing) {
      const sessionRaw = localStorage.getItem("physicsrishi_session");
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        session.currentChapter = nextChapter;
        localStorage.setItem("physicsrishi_session", JSON.stringify(session));
      }

      const accountsRaw = localStorage.getItem("physicsrishi_mock_accounts");
      if (accountsRaw) {
        const accounts = JSON.parse(accountsRaw);
        const accIdx = accounts.findIndex((a: any) => a.uid === uid);
        if (accIdx >= 0) {
          accounts[accIdx].currentChapter = nextChapter;
          localStorage.setItem("physicsrishi_mock_accounts", JSON.stringify(accounts));
        }
      }
    }
    return merged;
  }

  if (!db) return defaultProgress;

  // Live Firebase Mode
  try {
    const docRef = doc(db, "chapterProgress", `${uid}_${chapterId}`);
    const docSnap = await getDoc(docRef);
    
    const existing = docSnap.exists() ? (docSnap.data() as ChapterProgress) : defaultProgress;
    merged = {
      ...existing,
      ...fields,
      uid,
      chapterId,
    };

    // Unlocking Rule Check
    const wasCompleted = existing.chapterCompleted;
    const isCompletedNow = 
      merged.mindMapCompleted &&
      merged.conceptsCompleted &&
      merged.formulaSheetCompleted &&
      merged.examplesCompleted &&
      merged.conceptTestScore >= 60 &&
      merged.competitionTestScore >= 70;

    merged.chapterCompleted = isCompletedNow;

    await setDoc(docRef, merged);

    // Auto-advance
    const nextChapter = chapterId + 1;
    const isAdvancing = !wasCompleted && isCompletedNow && currentUserChapter === chapterId;

    if (isAdvancing) {
      await updateDoc(doc(db, "users", uid), {
        currentChapter: nextChapter,
      });
    }
    return merged;
  } catch (err) {
    console.error("Failed to update database progress:", err);
    throw err;
  }
}
