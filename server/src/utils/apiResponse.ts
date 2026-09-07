import { Response } from 'express';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(
  res: Response,
  message: string = 'Something went wrong',
  statusCode: number = 400,
  errors: unknown = null
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}
