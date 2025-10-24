"use client";

import { Note } from "@/types/todo";

export default function TodoStats({ notes }: { notes: Note[] }) {
  return (
    <div className="mb-4 text-center">
      <div className="inline-flex items-center gap-4 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
        <span>📋 Total: {notes.length}</span>
        <span>⏳ Active: {notes.filter((note) => !note.completed).length}</span>
        <span>
          ✅ Completed: {notes.filter((note) => note.completed).length}
        </span>
      </div>
    </div>
  );
}
