import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const GET = async (req: Request): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const notes = await prisma.note.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });

    if (!notes) {
      return new NextResponse(JSON.stringify({ error: "No notes found" }), {
        status: 404,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "Notes fetched successfully", data: notes }),
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse("Error in fetching notes: " + message, {
      status: 500,
    });
  }
};

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const formData = await req.json();
    const title = (formData.content as string) || "";
    const content = (formData.content as string) || "";

    const addNote = await prisma.note.create({
      data: {
        title,
        content,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Note created successfully",
        data: addNote,
      }),
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse("Error in updating note: " + message, {
      status: 500,
    });
  }
};
