/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import type { Response } from "express";
import { ApiResponse } from "../types/api-response.type.js";

@Injectable()
export class TransformSuccessResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();
    const statusCode = res.statusCode;
    return next.handle().pipe(
      map(
        data =>
          ({
            statusCode,
            message: "Success",
            data: data ?? null,
          }) satisfies ApiResponse<T | null>,
      ),
    );
  }
}
