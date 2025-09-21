import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { id } = params;

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

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    await prisma.laboratorium.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
};
