import { NextResponse } from "next/server";
import { handleDeleImage } from "../../actions";

export async function DELETE(
  request: Request,
  { params }: { params: { publicId: string } }
) {
  try {
    const { publicId } = params;
    await handleDeleImage(publicId);
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
