import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/db";
import { z } from "zod";

// Define schema for request validation
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request data
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: result.error.errors },
        { status: 400 }
      );
    }
    
    const { email, username, password } = result.data;
    
    // Check if email already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUserByEmail) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }
    
    // Check if username already exists
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });
    
    if (existingUserByUsername) {
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await hash(password, 10);
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        status: "PENDING", // User needs to verify email
        // Generate a random verification token here
        // In a real app, you'd send an email with this token
      },
    });
    
    // Create default wallet for the user
    // Get all cryptocurrencies
    const currencies = await prisma.cryptocurrency.findMany({
      where: { isActive: true },
    });
    
    // Create a wallet for each currency
    for (const currency of currencies) {
      await prisma.wallet.create({
        data: {
          userId: user.id,
          currencyId: currency.id,
          balance: "0",
          lockedBalance: "0",
        },
      });
    }
    
    // In a real app, send verification email here
    
    return NextResponse.json(
      { 
        message: "User registered successfully",
        userId: user.id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}