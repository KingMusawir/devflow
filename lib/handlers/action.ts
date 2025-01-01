'use server';

import { Session } from 'next-auth';
import { ZodError, ZodSchema } from 'zod';

import { auth } from '@/auth';
import { UnauthorizedError, ValidationError } from '@/lib/http-error';
import dbConnect from '@/lib/mongoose';

type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

async function action<T>({ params, schema, authorize }: ActionOptions<T>) {
  // 1. Check whether the schema and params are provided and validated
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(
          error.flatten().fieldErrors as Record<string, string[]>,
        );
      } else {
        return new Error('Schema validation failed');
      }
    }
  }

  // 2. Check whether the user is authorized
  let session: Session | null = null;

  if (authorize) {
    session = await auth();

    if (!session) {
      return new UnauthorizedError();
    }
  }
  // 3. Connect to the database
  await dbConnect();

  // 4. Return the params and session
  return { params, session };
}

export default action;
