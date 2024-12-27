import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import slugify from 'slugify';

import Account from '@/database/account.model';
import User from '@/database/user.model';
import handleError from '@/lib/handlers/error';
import { ValidationError } from '@/lib/http-error';
import dbConnect from '@/lib/mongoose';
import { SIgnInWithOauthSchema } from '@/lib/validations';
import { APIErrorResponse } from '@/types/global';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { provider, providerAccountId, user } = await request.json();
  console.log('providerAccountId, SigninAuth:', providerAccountId);

  await dbConnect();

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    // Sign a User in with OAuth
    const validatedData = SIgnInWithOauthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const { name, username, email, image } = user;

    // If everything is valid, we can proceed with generating the username
    const slugifyUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    // find the user by email
    let existingUser = await User.findOne({ email }).session(session);

    // If the user does not exist, we create a new user
    if (!existingUser) {
      [existingUser] = await User.create(
        [
          {
            name,
            username: slugifyUsername,
            email,
            image,
          },
        ],
        { session },
      );
    } else {
      // If the user exists, we update the user's name and image using the new oAuthProvider
      const updatedData: {
        name?: string;
        image?: string;
      } = {};

      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;

      if (Object.keys(updatedData).length > 0) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updatedData },
        ).session(session);
      }
    }

    // Check if the account already exists attached to the userID
    const existingAccount = await Account.findOne({
      $and: [
        { providerAccountId },
        { provider }, // To distinguish between different OAuth providers
        { userId: existingUser._id }, // To ensure account belongs to correct user
      ],
    }).session(session);

    // If the account does not exist, we create a new account
    let account;
    if (!existingAccount) {
      [account] = await Account.create(
        [
          {
            userId: existingUser._id,
            name,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session },
      );
    } else {
      account = existingAccount;
    }
    // we commit our transaction
    await session.commitTransaction();

    return NextResponse.json({
      success: true,
      account,
    });
  } catch (error: unknown) {
    await session.abortTransaction();
    return handleError(error, 'api') as APIErrorResponse;
  } finally {
    await session.endSession();
  }
}
