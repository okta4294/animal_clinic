import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    const body = await req.json();
    const updated = await prisma.scientific.update({
      where: { animal_id: id },
      data: {
        animal_id: body.animal_id,
        date_of_entry: new Date(body.date_of_entry),
        common_name: body.common_name,
        animal_type: body.animal_type,
        cage_number: body.cage_number,
        sex: body.sex,
        reason_for_admission: body.reason_for_admission,
        date_of_discharge: new Date(body.date_of_discharge),
      },
    });
    return NextResponse.json({ message: "Updated", data: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
};

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    await prisma.scientific.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
};
