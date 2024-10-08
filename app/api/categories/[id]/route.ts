import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { handleDeleImage } from "../../actions";

// fetch single record by params id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const record = await prisma.category.findUnique({
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
    const { label, slug, image_url, public_id } = await req.json();
    const record = await prisma.category.update({
      where: { id: params.id },
      data: {
        label,
        slug,
        image_url,
        public_id,
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
    const record = await prisma.category.findFirst({
      where: { id: params.id },
    });

    await handleDeleImage(record?.public_id as any);

    const deletedRecord = await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json(deletedRecord, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal server error.", { status: 500 });
  }
}
