import { HttpException } from "@nestjs/common";
import { ApiResponse } from "../shared/types/api-response.type.js";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PostgresException extends Error {
  readonly cause: {
    code: string;
    severity: string;
    constraint?: string;
    detail?: string;
  };
}

export class ApiResponseException<T> extends HttpException {
  private readonly data: T;

  public constructor(options: ApiResponse<T>) {
    super(options.message, options.statusCode);
    this.data = options.data;
  }

  public getData() {
    return this.data;
  }
}

export function isPostgresException(error: any): error is PostgresException {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return error.cause?.code && error.cause?.severity === "ERROR";
}
