import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const filePath = path.join(process.cwd(), "data", "destinations.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const destinations = JSON.parse(raw);

  const name = req.nextUrl.searchParams.get("name");

  if (name) {
    const found = destinations.find((d: any) => d.name === name);
    if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(found);
  }

  // name 없으면 랜덤
  const picked = destinations[Math.floor(Math.random() * destinations.length)];
  return NextResponse.json(picked);
}
