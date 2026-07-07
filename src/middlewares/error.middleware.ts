import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/HttpException";
import { ResponseHTTP } from "../utils/response";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpException) {
    return res
      .status(err.status)
      .json(ResponseHTTP.error(err.status, err.message));
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    return res
      .status(400)
      .json(ResponseHTTP.error(400, "Validation Error", formattedErrors));
  }

  console.error("💥 Unexpected Error:", err);
  const status = 500;
  const message = process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message;
  return res.status(status).json(ResponseHTTP.error(status, message));
};
