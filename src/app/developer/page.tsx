"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  unlockNextChapter,
  unlockAllChapters,
  resetProgress,
  jumpToChapter,
} from "@/lib/developer";
export default function DeveloperPage() {
  const { user, refreshUserProfile } = useAuth();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(1);
  useEffect(() => {
    if (user) {
      setSelectedChapter(user.currentChapter);
    }
  }, [user]);
  if (!user) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center text-white">
        Please login first.
      </div>
    );
  }

  const execute = async (action: () => Promise<any>, success: string) => {
    try {
      setLoading(true);
      setMessage("");

      await action();

      await refreshUserProfile();

      setMessage(success);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-physics-purple">
          PhysicsRishi Developer Console
        </h1>

        <div className="bg-dark-card rounded-2xl border border-dark-border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-5">Current User</h2>

          <div className="space-y-3">
            <p>
              <strong>Name :</strong> {user.name}
            </p>

            <p>
              <strong>Email :</strong> {user.email}
            </p>

            <p>
              <strong>Exam :</strong> {user.exam}
            </p>

            <p>
              <strong>Current Chapter :</strong>{" "}
              <span className="text-physics-purple font-bold text-2xl">
                {user.currentChapter}
              </span>
            </p>
          </div>
        </div>
        <div className="bg-dark-card rounded-2xl border border-dark-border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-5">Jump To Chapter</h2>

          <div className="flex gap-4 items-center">
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2"
            >
              {Array.from({ length: 29 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Chapter {i + 1}
                </option>
              ))}
            </select>

            <button
              disabled={loading}
              onClick={() =>
                execute(
                  () => jumpToChapter(user.uid, selectedChapter),
                  `Jumped to Chapter ${selectedChapter}`,
                )
              }
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-5 py-2 rounded-lg font-semibold"
            >
              Open
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <button
            disabled={loading}
            onClick={() =>
              execute(
                () => unlockNextChapter(user.uid, user.currentChapter),
                "Next chapter unlocked.",
              )
            }
            className="bg-purple-600 hover:bg-purple-700 rounded-xl p-5 font-semibold transition"
          >
            🚀 Unlock Next Chapter
          </button>

          <button
            disabled={loading}
            onClick={() =>
              execute(
                () => unlockAllChapters(user.uid),
                "All chapters unlocked.",
              )
            }
            className="bg-blue-600 hover:bg-blue-700 rounded-xl p-5 font-semibold transition"
          >
            ⭐ Unlock All Chapters
          </button>

          <button
            disabled={loading}
            onClick={() =>
              execute(() => resetProgress(user.uid), "Progress reset.")
            }
            className="bg-red-600 hover:bg-red-700 rounded-xl p-5 font-semibold transition"
          >
            🔄 Reset Progress
          </button>
        </div>

        {message && (
          <div className="mt-8 rounded-xl bg-green-900/40 border border-green-600 p-4">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
