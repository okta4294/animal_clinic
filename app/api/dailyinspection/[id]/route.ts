import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    const body = await req.json();
    const updated = await prisma.dailyInspection.updateMany({
      where: { animal_id: id },
      data: {
        animal_id: body.animal_id,
        inspection_date: new Date(body.inspection_date),
        animal_weight : Number(body.animal_weight),
        drug_name: body.drug_name,
        dosage: body.dosage,
        food_given: body.food_given,
        balance_food_take_out: body.balance_food_take_out,
        dopping_consistency: body.dopping_consistency,
        animal_behavior: body.animal_behavior
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
    await prisma.dailyInspection.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
};
