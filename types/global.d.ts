import { NextResponse } from 'next/server';

interface Tag {
  _id: string;
  name: string;
}

interface Author {
  _id: string;
  name: string;
  image: string;
}

interface Question {
  _id: string;
  title: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  upvotes: number;
  answers: number;
  views: number;
}

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    detail?: Record<string, string[]>;
  };
  status?: number;
};

// Base on the ActionResponse type, we can create different types of responses:
type SuccessResponse<T> = ActionResponse<T> & {
  success: true;
};

type ErrorResponse = ActionResponse & {
  success: false;
};

type APIErrorResponse = NextResponse<ErrorResponse>;

type APIResponse<T = null> = NextResponse<SuccessResponse<T>> | ErrorResponse;
