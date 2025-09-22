import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { writeFile } from "fs/promises"
import path from "path"

export const POST = async (req: Request) => {
  try {
    const body = await req.json(); // Mengubah dari formData() ke json()

    // Data yang diterima dari frontend
    const {
      animal_id,
      test_type,
      diagnosis,
      drug_name,
      test_date,
      description,
      attachment_file, // URL dari UploadThing
    } = body;

    const laboratorium = await prisma.laboratorium.create({
      data: {
        animal_id,
        test_type,
        diagnosis,
        drug_name,
        test_date: new Date(test_date),
        description,
        attachment_file, // Simpan URL dari UploadThing
      },
    });

    return NextResponse.json({
      message: "Data berhasil disimpan",
      data: laboratorium,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan data" }, 
      { status: 500 }
    );
  }
};



export const GET = async (req: Request) => {
    try {
      const laboratorium = await prisma.laboratorium.findMany();
      return NextResponse.json({ message: "Data received", data: laboratorium });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
};
