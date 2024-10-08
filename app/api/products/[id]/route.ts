import prisma from "@/lib/prisma";
import { Media } from "@prisma/client";
import { NextResponse } from "next/server";
import { handleDeleImage } from "../../actions";

// Fetch Record using id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const record = await prisma.product.findUnique({
      where: { id: params.id },
      include: { media: true },
    });
    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

// update record
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, media } = body;

    // Update the product first
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
      },
    });

    if (media && media.length > 0) {
      // Using a transaction to ensure both product and media updates succeed or fail together
      await prisma.$transaction(
        media.map((image: Media) =>
          prisma.media.upsert({
            where: { publicId: image.publicId }, // Assuming publicId is the identifier
            update: { imageUrl: image.imageUrl }, // Update existing media
            create: {
              imageUrl: image.imageUrl, // Create new media entry
              publicId: image.publicId,
              productId: product.id, // Associate with the product
            },
          })
        )
      );
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// delete product by params id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const media = await prisma.media.findMany({
      where: { productId: params.id },
    });

    if (media.length > 0) {
      media.forEach(async (image) => {
        await handleDeleImage(image.publicId)
          .then(() => {
            console.log("Image deleted successfully");
          })
          .catch((error) => {
            console.error("Error deleting image:", error);
          });
      });
    }

    const product = await prisma.product.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
