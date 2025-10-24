"use client";

import { useTodoStore } from "@/lib/todo-store";
import { useState } from "react";
import { toast } from "sonner";

export default function AddTodoForm({
  id,
  onChanged,
}: {
  id: string | undefined;
  onChanged?: () => void;
}) {
  const [input, setInput] = useState("");
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const toastId = toast.loading("Adding todo...");
    try {
      const response = await fetch(`/api/note?userId=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }

      toast.success("Todo added successfully!", { id: toastId });
      setInput("");

      onChanged?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error creating todo",
        { id: toastId }
      );
      console.error("Error creating todo:", error);
    }
  };

  return (
    <div className="mb-6 flex gap-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        type="text"
        className="flex-1 px-4 py-2 border border-gray-600 rounded-lg"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        ➕
      </button>
    </div>
  );
}
