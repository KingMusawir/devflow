import { NextResponse } from 'next/server';

import User from '@/database/user.model';
import handleError from '@/lib/handlers/error';
import { ValidationError } from '@/lib/http-error';
import dbConnect from '@/lib/mongoose';
import { UserSchema } from '@/lib/validations';
import { APIErrorResponse } from '@/types/global';

// Get all users
export async function GET() {
  try {
    await dbConnect();

    const users = await User.find();

    return NextResponse.json(
      {
        success: true,
        data: users,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse;
  }
}

// Create user DataBase
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const validatedUser = UserSchema.safeParse(body);

    if (!validatedUser.success) {
      throw new ValidationError(validatedUser.error.flatten().fieldErrors);
    }
    const { email, username } = validatedUser.data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      throw new Error('User with this username already exists');
    }

    const newUser = await User.create(validatedUser.data);

    return NextResponse.json(
      {
        success: true,
        data: newUser,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse;
  }
}
