import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { writeFile } from "fs/promises"
import path from "path"

export const POST = async (req: Request) => {
  try {
    const {animal_id,inspection_date,animal_weight,drug_name,dosage,food_given,balance_food_take_out,dopping_consistency,animal_behavior,userId} = await req.json();
      console.log(animal_id, inspection_date,animal_weight,drug_name,dosage,food_given,balance_food_take_out,dopping_consistency,animal_behavior,userId);
      const inspection = await prisma.dailyInspection.create({ data: { 
        animal_id,
        inspection_date: new Date(inspection_date),
        animal_weight : Number(animal_weight),
        drug_name,
        dosage,
        food_given,
        balance_food_take_out,
        dopping_consistency,
        animal_behavior,
        userId} });    
      return NextResponse.json({ message: "Data received", data: inspection });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
};

export const GET = async (req: Request) => {
    try {
      const animals = await prisma.dailyInspection.findMany();
      return NextResponse.json({ message: "Data received", data: animals });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
};
