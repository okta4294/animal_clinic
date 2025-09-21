import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (req: Request) => {
    try {
      const {name,email,password} = await req.json();
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(name,email,password);
      const users = await prisma.user.create({ data: {
        name,
        email,
        password:hashedPassword,} });   
      return NextResponse.json({ message: "Data received", data: users });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
};

export const GET = async (req: Request) => {
    try {
      const users = await prisma.user.findMany();
      return NextResponse.json({ message: "Data received", data: users });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
};
