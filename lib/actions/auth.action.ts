'use server';

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import { signIn } from '@/auth';
import Account from '@/database/account.model';
import User from '@/database/user.model';
import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/error';
import { SignUpSchema } from '@/lib/validations';
import { ActionResponse, ErrorResponse } from '@/types/global';

export async function signUpWithCredentials(
  params: AuthCredentials,
): Promise<ActionResponse> {
  //   validate the data we are passing to this function
  const validationResult = await action({ params, schema: SignUpSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, email, password } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);

    if (existingUser) {
      throw new Error('User already exists');
    }

    const existingUsername = await User.findOne({ username }).session(session);

    if (existingUsername) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await User.create([{ name, username, email }], {
      session,
    });

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: 'credentials',
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    await signIn('credentials', { email, password, redirect: false });
    return { success: true };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
