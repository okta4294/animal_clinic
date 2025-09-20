import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
      const {animal_id, date_of_entry,animal_name,animal_type,cage_number, sex, reason_of_admission} = await req.json();
      console.log(animal_id, date_of_entry,animal_name,animal_type,cage_number, sex, reason_of_admission);
      const animal = await prisma.scientific.create({ data: {
        animal_id, 
        date_of_entry : new Date(date_of_entry),
        common_name: animal_name,
        animal_type,
        cage_number, 
        sex, 
        reason_for_admission : reason_of_admission} });    
      return NextResponse.json({ message: "Data received", data: animal });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
};

export const GET = async (req: Request) => {
    try {
      const animals = await prisma.scientific.findMany();
      return NextResponse.json({ message: "Data received", data: animals });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
};