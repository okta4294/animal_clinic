import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(req: NextRequest) {
  try {
    const { fileKey } = await req.json();

    if (!fileKey) {
      return NextResponse.json(
        { error: "File key is required" },
        { status: 400 }
      );
    }

    // Hapus file dari UploadThing
    const result = await utapi.deleteFiles(fileKey);

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to delete file from UploadThing" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "File deleted successfully from UploadThing",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}