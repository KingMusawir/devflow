import { NextResponse } from 'next/server';

import Account from '@/database/account.model';
import handleError from '@/lib/handlers/error';
import { NotFoundError, ValidationError } from '@/lib/http-error';
import dbConnect from '@/lib/mongoose';
import { AccountSchema } from '@/lib/validations';
import { APIErrorResponse } from '@/types/global';

export async function POST(request: Request) {
  const { providerAccountId } = await request.json();
  console.log('providerAccountId Provider:', providerAccountId);

  try {
    await dbConnect();
    const validateAccount = AccountSchema.partial().safeParse({
      providerAccountId,
    });

    if (!validateAccount.success)
      throw new ValidationError(validateAccount.error.flatten().fieldErrors);

    const account = await Account.findOne({ providerAccountId });

    if (!account) throw new NotFoundError('Account');

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
