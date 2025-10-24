import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const GET = async (req: Request): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(req.url);
    const noteId = searchParams.get("noteId");

    if (!noteId) {
      return NextResponse.json({ error: "Missing noteId" }, { status: 400 });
    }

    const note = await prisma.note.findUnique({
      where: {
        id: noteId,
      },
      include: {
        user: true,
      },
    });

    if (!note) {
      return new NextResponse(JSON.stringify({ error: "Note not found" }), {
        status: 404,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "Note fetched successfully", data: note }),
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse("Error in fetching note: " + message, {
      status: 500,
    });
  }
};

// export const POST = async (req: Request): Promise<NextResponse> => {
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("noteId");

//     if (!noteId) {
//       return NextResponse.json({ error: "Missing noteId" }, { status: 400 });
//     }

//     const formData = await req.json();
//     const title = (formData.title as string) || "";
//     const content = (formData.content as string) || "";

//     const updatedNote = await prisma.note.update({
//       where: {
//         id: noteId,
//       },
//       data: {
//         title,
//         content,
//       },
//     });

//     return new NextResponse(
//       JSON.stringify({
//         message: "Note updated successfully",
//         data: updatedNote,
//       }),
//       { status: 200 }
//     );
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : "Unknown error";
//     return new NextResponse("Error in updating note: " + message, {
//       status: 500,
//     });
//   }
// };

export const PATCH = async (req: Request): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(req.url);
    const noteId = searchParams.get("noteId");

    if (!noteId) {
      return NextResponse.json({ error: "Missing noteId" }, { status: 400 });
    }

  const formData = await req.json();
  const title = formData.content as string | undefined;
  const content = formData.content as string | undefined;
  const completed = formData.completed as boolean | undefined;

    const updatedNote = await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        title,
        content,
        ...(typeof completed === "boolean" ? { completed } : {}),
      },
    });
    return new NextResponse(
      JSON.stringify({
        message: "Note patched successfully",
        data: updatedNote,
      }),
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse("Error in patching note: " + message, {
      status: 500,
    });
  }
};

export const DELETE = async (req: Request): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(req.url);
    const noteId = searchParams.get("noteId");
    if (!noteId) {
      return NextResponse.json({ error: "Missing noteId" }, { status: 400 });
    }

    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Note deleted successfully" }),
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse("Error in deleting note: " + message, {
      status: 500,
    });
  }
};
