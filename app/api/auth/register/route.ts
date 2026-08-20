import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  group: z.string().min(1, "Please select a department/group"),
  role: z.enum(["EMPLOYEE", "BOARD_ADMIN"]).default("EMPLOYEE"),
  title: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, group, role, title } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const tone =
      role === "BOARD_ADMIN"
        ? "#334155"
        : ["#2563EB", "#7C3AED", "#059669", "#D97706"][
            Math.floor(Math.random() * 4)
          ];

    const newUser = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        role,
        group,
        title: title || (role === "BOARD_ADMIN" ? "Board Administrator" : "Team Member"),
        initials,
        tone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        group: true,
      },
    });

    return NextResponse.json(
      { message: "Account created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    
    // Surface Prisma connection or missing table errors directly to the UI
    let errorMessage = "Internal server error occurred";
    if (error.code === "P2021") {
      errorMessage = "Database not initialized. Please run 'npx prisma db push' or migrations on your production database.";
    } else if (error.message?.includes("DATABASE_URL")) {
      errorMessage = "DATABASE_URL is missing in Vercel Environment Variables.";
    } else if (error.message) {
      // Provide a sanitized version of the Prisma error for debugging
      errorMessage = "Database Error: " + error.message.split("\n").slice(-1)[0];
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
