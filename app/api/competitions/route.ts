import { NextResponse } from "next/server";
import { addCompetition, getCompetitions } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { ALL_CATEGORIES, Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getCompetitions());
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Hanya panitia yang boleh menambah lomba." },
      { status: 401 }
    );
  }
  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const category = body.category as Category;

  if (!name) {
    return NextResponse.json(
      { error: "Nama perlombaan wajib diisi." },
      { status: 400 }
    );
  }
  if (!ALL_CATEGORIES.includes(category)) {
    return NextResponse.json(
      { error: "Kategori tidak valid." },
      { status: 400 }
    );
  }

  const competition = await addCompetition({ name, category, description });
  return NextResponse.json(competition, { status: 201 });
}
