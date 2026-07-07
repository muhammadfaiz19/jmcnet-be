import { HttpException } from "./HttpException";

export class InternalServerError extends HttpException {
  constructor(message: string = "Internal Server Error") {
    super(500, message);
  }
}
