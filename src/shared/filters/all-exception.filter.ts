import {
  Logger,
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
} from "@nestjs/common";
import type { Response } from "express";
import { isPostgresException } from "../../utils/exception.utils.js";
import { ApiResponse } from "../types/api-response.type.js";
import { createApiResponseBodyFromPostgresException } from "../../utils/api-response.utils.js";
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    console.log("Exception caught in AllExceptionFilter");
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      res.status(exception.getStatus()).json({
        statusCode,
        message: exception.message,
        data: null,
      } satisfies ApiResponse<null>);
      return;
    }

    if (isPostgresException(exception)) {
      this.logger.error("PostgresException", exception);
      const body = createApiResponseBodyFromPostgresException(exception);
      res.status(body.statusCode).json(body);
      return;
    }

    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      data: null,
    } satisfies ApiResponse<null>);
  }
}
