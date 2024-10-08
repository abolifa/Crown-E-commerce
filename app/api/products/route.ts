import prisma from "@/lib/prisma";
import { Media } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const records = await prisma.product.findMany({
      include: { media: true },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, media } = body;

    // Insert the product first
    const product = await prisma.product.create({
      data: {
        name,
      },
    });

    if (media && media.length > 0) {
      const mediaData = media.map((image: Media) => ({
        imageUrl: image.imageUrl,
        publicId: image.publicId,
        productId: product.id,
      }));

      await prisma.media.createMany({
        data: mediaData,
      });
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
