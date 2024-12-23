import { NextResponse } from 'next/server';

import Account from '@/database/user.model';
import handleError from '@/lib/handlers/error';
import { NotFoundError, ValidationError } from '@/lib/http-error';
import dbConnect from '@/lib/mongoose';
import { AccountSchema } from '@/lib/validations';
import { APIErrorResponse } from '@/types/global';

// GET /api/account/[id]
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError('Account');
  }

  try {
    await dbConnect();

    const account = await Account.findById(id);

    if (!account) {
      throw new NotFoundError('Account');
    }
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

// DELETE /api/account/[id]
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError('Account');
  }

  try {
    await dbConnect();

    const account = await Account.findByIdAndDelete(id);

    if (!account) {
      throw new NotFoundError('Account');
    }
    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      { status: 204 },
    );
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse;
  }
}

// PUT /api/account/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError('Account');
  }

  try {
    await dbConnect();

    const body = await request.json();
    const validatedAccount = AccountSchema.partial().safeParse(body);

    if (!validatedAccount.success) {
      throw new ValidationError(validatedAccount.error.flatten().fieldErrors);
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      validatedAccount,
      {
        new: true,
      },
    );

    if (!updatedAccount) {
      throw new NotFoundError('Account');
    }
    return NextResponse.json(
      {
        success: true,
        data: updatedAccount,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse;
  }
}
