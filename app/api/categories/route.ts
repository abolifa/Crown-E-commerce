import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fetch All records
export async function GET() {
  try {
    const records = await prisma.category.findMany();
    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal server error.", { status: 500 });
  }
}

// create new record
export async function POST(request: Request) {
  try {
    const { label, slug, image_url, public_id } = await request.json();
    const record = await prisma.category.create({
      data: {
        label,
        slug,
        image_url,
        public_id,
      },
    });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal server error.", { status: 500 });
  }
}
