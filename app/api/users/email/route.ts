import { NextResponse } from 'next/server';

import User from '@/database/user.model';
import handleError from '@/lib/handlers/error';
import { NotFoundError, ValidationError } from '@/lib/http-error';
import { UserSchema } from '@/lib/validations';
import { APIErrorResponse } from '@/types/global';

export async function POST(request: Request) {
  const { email } = await request.json();
  try {
    const validateUser = await UserSchema.partial().safeParse({ email });

    if (!validateUser.success)
      throw new ValidationError(validateUser.error.flatten().fieldErrors);
    const user = await User.findOne({ email });

    if (!user) throw new NotFoundError('User');

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse;
  }
}