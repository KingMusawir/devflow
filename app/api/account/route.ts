import { NextResponse } from 'next/server';

import Account from '@/database/account.model';
import handleError from '@/lib/handlers/error';
import { ForbiddenError } from '@/lib/http-error';
import dbConnect from '@/lib/mongoose';
import { AccountSchema } from '@/lib/validations';
import { APIErrorResponse } from '@/types/global';

export async function GET() {
  try {
    await dbConnect();

    const account = await Account.find();

    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse;
  }
}

// Create Account
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const validatedAccount = AccountSchema.safeParse(body);

    const existingAccount = await Account.findOne({
      provider: validatedAccount.data?.provider,
      providerAccountId: validatedAccount.data?.providerAccountId,
    });

    if (existingAccount) {
      throw new ForbiddenError('An account with the same already exists');
    }

    const newAccount = await Account.create(validatedAccount);

    return NextResponse.json(
      {
        success: true,
        data: newAccount,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse;
  }
}
