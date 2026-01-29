import { NextResponse } from "next/server";

let sales = 100;
let users = 50;
let inventory = 200;

export async function GET() {
  sales += Math.floor(Math.random() * 5);
  users += Math.floor(Math.random() * 3);
  inventory -= Math.floor(Math.random() * 2);

  return NextResponse.json({ sales, users, inventory });
}
