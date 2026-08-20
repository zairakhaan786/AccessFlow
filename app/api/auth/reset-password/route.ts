import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(req: Request) {
  try {
    const { email, password, token } = await req.json();

    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: "Invalid data provided" }, { status: 400 });
    }

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "A valid reset token is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (!user.resetToken || !user.resetTokenExpiresAt) {
      return NextResponse.json(
        { error: "No password reset was requested for this account" },
        { status: 400 }
      );
    }

    if (user.resetTokenExpiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "This reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const providedHash = hashToken(token);
    if (providedHash !== user.resetToken) {
      return NextResponse.json(
        { error: "Invalid or already used reset link" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email: user.email },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}