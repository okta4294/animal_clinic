import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { deleteUploadThingFile } from "@/lib/src/utils/uploadthing"

export async function PUT( req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const { id } = await params;

    const updatedRecord = await prisma.laboratorium.update({
      where: { id },
      data: {
        animal_id: body.animal_id,
        test_type: body.test_type,
        diagnosis: body.diagnosis,
        drug_name: body.drug_name,
        test_date: new Date(body.test_date),
        description: body.description,
        attachment_file: body.attachment_file || null,
      },
    });

    return NextResponse.json({
      message: "Data updated successfully",
      data: updatedRecord,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Dapatkan data sebelum dihapus untuk mendapatkan file URL
    const record = await prisma.laboratorium.findUnique({
      where: { id },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Record not found" },
        { status: 404 }
      );
    }

    // Hapus file dari UploadThing jika ada
    if (record.attachment_file && record.attachment_file.includes('utfs.io')) {
      try {
        await deleteUploadThingFile(record.attachment_file);
        console.log("File deleted from UploadThing");
      } catch (fileError) {
        console.error("Error deleting file from UploadThing:", fileError);
        // Lanjutkan menghapus record meskipun file gagal dihapus
      }
    }

    // Hapus record dari database
    await prisma.laboratorium.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Data deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}