import { NextResponse } from "next/server";

export async function GET() {
  // Example stats, replace with DB values if needed
  const stats = {
    totalProducts: 150,
    totalStock: 500,
    totalSales: 200000,
    invoices: 45,
  };
  return NextResponse.json(stats);
}
