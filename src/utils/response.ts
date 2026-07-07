export class ResponseHTTP {
  public status: number;
  public success: boolean;
  public message: string;
  public data?: any;
  public errors?: any;

  constructor(status: number, success: boolean, message: string, data?: any, errors?: any) {
    this.status = status;
    this.success = success;
    this.message = message;
    if (data !== undefined) this.data = data;
    if (errors !== undefined) this.errors = errors;
  }

  public static ok(data: any, message: string = "Success") {
    return new ResponseHTTP(200, true, message, data);
  }

  public static created(data: any, message: string = "Created Successfully") {
    return new ResponseHTTP(201, true, message, data);
  }

  public static success(status: number, data: any, message: string = "Success") {
    return new ResponseHTTP(status, true, message, data);
  }

  public static error(status: number, message: string = "Error", errors?: any) {
    return new ResponseHTTP(status, false, message, undefined, errors);
  }
}
export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
};
