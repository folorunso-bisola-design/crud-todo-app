"use client";

import { Todo } from "@/types/todo";
import { useState } from "react";
import { toast } from "sonner";

export default function NoteItem({
  id,
  note,
  onChanged,
}: {
  id: string;
  note: Todo;
  onChanged?: () => void;
}) {
  console.log(id);
  console.log(note);

  const [loading, setLoading] = useState(false);
  const [optimisticCompleted, setOptimisticCompleted] = useState(
    !!note.completed
  );

  async function deleteNote(id: string) {
    setLoading(true);
    const toastId = toast.loading("Deleting note...");
    try {
      const res = await fetch(`/api/note/${id}?noteId=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete note");
      toast.success("Note deleted successfully", { id: toastId });
      onChanged?.();
    } catch {
      toast.error("Failed to delete note", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  async function updatedNote(content: string) {
    setLoading(true);
    const toastId = toast.loading("Updating note...");
    try {
      const res = await fetch(`/api/note/${note.id}?noteId=${note.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to update note");
      toast.success("Note updated successfully", { id: toastId });
      onChanged?.();
    } catch {
      toast.error("Failed to update note", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  async function toggleNoteCompletion(id: string) {
    if (loading) return;
    const next = !optimisticCompleted;
    // Optimistically update UI
    setOptimisticCompleted(next);
    setLoading(true);
    const toastId = toast.loading("Updating note...");
    try {
      const res = await fetch(`/api/note/${id}?noteId=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: next }),
      });
      if (!res.ok) throw new Error("Failed to update note");
      toast.success("Note updated", { id: toastId });
      onChanged?.();
    } catch {
      // Revert UI on failure
      setOptimisticCompleted(!next);
      toast.error("Failed to update note", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState<string>(note.content ?? "");

  const handleSaveEdit = () => {
    if (editText.trim()) {
      updatedNote(editText);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(note.content ?? "");
    setIsEditing(false);
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 border rounded-lg ${
        note.completed
          ? "bg-gray-50 border-gray-200"
          : "bg-white border-gray-300"
      }`}
    >
      {/* checkbox */}
      <input
        type="checkbox"
        className="w-5 h-5 text-blue-600"
        checked={optimisticCompleted}
        onChange={() => toggleNoteCompletion(note.id)}
        disabled={loading}
      />
      {/* text todo */}
      <div className="flex-1">
        {isEditing ? (
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
            className="w-full px-2 py-1 border rounded"
            autoFocus
          />
        ) : (
          <span
            className={`${
              optimisticCompleted
                ? "line-through text-gray-500"
                : "text-gray-800"
            }`}
          >
            {note.content}
          </span>
        )}
      </div>
      {/* action button */}
      <div className="flex gap-1">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveEdit}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
            >
              ✅
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
            >
              ❌
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
            >
              ✏️
            </button>
            <button
              onClick={() => deleteNote(note.id)}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
}
