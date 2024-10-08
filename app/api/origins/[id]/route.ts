import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// fetch single record by params id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const record = await prisma.origin.findUnique({
      where: { id: params.id },
    });
    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal server error.", { status: 500 });
  }
}

// update a record by params id
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { label } = await req.json();
    const record = await prisma.origin.update({
      where: { id: params.id },
      data: {
        label,
      },
    });
    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal server error.", { status: 500 });
  }
}

// delete a record
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedRecord = await prisma.origin.delete({
      where: { id: params.id },
    });

    return NextResponse.json(deletedRecord, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal server error.", { status: 500 });
  }
}
