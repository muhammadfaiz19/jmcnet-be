import { Request } from "express";

export interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: any;
}

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    email: string;
  };
}
