"use client";

import AddTodoForm from "@/components/add-todo-form";
import TodoStats from "@/components/todo-stats";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import { signOut } from "@/actions/auth";

import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import NoteItem from "@/components/note-item";

export default function Home() {
  type Note = {
    id: string;

    createdAt: Date | string;
    text?: string;
    content?: string;
    title?: string;
    completed?: boolean;
    [key: string]: unknown;
  };

  const [notes, setNotes] = React.useState<Note[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const { data: session, isPending } = authClient.useSession();

  React.useEffect(() => {
    if (!isPending && !session) {
      window.location.href = "/signin";
    }
  }, [session, isPending]);

  const fetchTodos = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user?email=${session?.user?.email}`);
      const data = await response.json();
      if (response.ok) {
        setNotes(data.data.notes);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error("Error fetching todos:", err);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email]);

  React.useEffect(() => {
    setIsLoading(true);
    if (session) {
      fetchTodos();
    }
  }, [session, fetchTodos]);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (err) {
      toast.error("Failed to sign out");
      console.error("Sign out error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-[5%] w-[5%] " />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="flex flex-col max-w-2xl mx-auto px-4">
        <Button
          className="self-end bg-red-500 hover:bg-red-600 text-white"
          onClick={() => {
            handleSignOut();
          }}
        >
          Sign Out
        </Button>
        <h1 className="text-3xl font-bold text-center text-black mb-6">
          Todo App
        </h1>
        <AddTodoForm id={session?.user?.id} onChanged={fetchTodos} />
        <TodoStats notes={notes} />

        <div className="space-y-2">
          {notes.length === 0 ? (
            <p className="text-center font-bold text-gray-900">No todos</p>
          ) : (
            notes.map((note) => (
              <NoteItem
                id={session?.user?.id ?? ""}
                key={note.id}
                note={note}
                onChanged={fetchTodos}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
