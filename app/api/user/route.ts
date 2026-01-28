import { NextResponse } from "next/server";

export async function GET() {
  const user = {
    name: "Bareera Nawaz",
    role: "admin", 
  };
  return NextResponse.json(user);
}
