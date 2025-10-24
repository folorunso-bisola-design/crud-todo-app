// import User from "@/lib/modals/user";
// import connect from "../../../../db";
// import bcrypt from "bcryptjs";

import { saltAndHashPassword } from "@/utils/helper";
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

interface RegisterRequestBody {
  email: string;
  password: string;
  name: string;
}

interface UserResponse {
  user: {
    id: string;
    email: string;
    hashedPassword: string;
    name: string;
  };
  message: string;
}

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const contentType = req.headers.get("content-type");
    console.log("Content-Type:", contentType);

    const formData = await req.json();

    const email = (formData.email as string) || "";
    const password = (formData.password as string) || "";
    const name = (formData.name as string) || "";

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    //if the user already exists, return a response with a status of 400
    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 });
    }

    //hashing the password
    const hashedPassword: string = saltAndHashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        accounts: {
          create: {
            accountId: email,
            providerId: "credential",
            password: hashedPassword,
          },
        },
      },
      include: {
        accounts: true,
      },
    });

    return new NextResponse(
      JSON.stringify({ user: newUser, message: "User created" }),
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new NextResponse("Error creating user: " + errorMessage, {
      status: 500,
    });
  }
};
