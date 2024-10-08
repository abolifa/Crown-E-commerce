import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fetch All records
export async function GET() {
  try {
    const records = await prisma.origin.findMany();
    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal server error.", { status: 500 });
  }
}

// create new record
export async function POST(request: Request) {
  try {
    const { label } = await request.json();
    const record = await prisma.origin.create({
      data: {
        label,
      },
    });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal server error.", { status: 500 });
  }
}
