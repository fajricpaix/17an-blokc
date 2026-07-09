import { NextResponse } from "next/server";
import { verifyCredentials, sessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !verifyCredentials(email, password)
  ) {
    return NextResponse.json(
      { error: "Email atau password salah." },
      { status: 401 }
    );
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 jam
  });
  return res;
}
