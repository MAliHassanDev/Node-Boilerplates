import { HttpStatus, Logger } from "@nestjs/common";
import { ApiResponse } from "../shared/types/api-response.type.js";
import { PostgresException } from "./exception.utils.js";

export function createApiResponseBody<T>(
  statusCode: number = HttpStatus.OK,
  message = "Success",
  data: T | null = null,
) {
  return {
    message,
    statusCode,
    data,
  } satisfies ApiResponse<T | null>;
}

export function createApiResponseBodyFromPostgresException(
  exception: PostgresException,
): ApiResponse<null> {
  switch (exception.cause.code) {
    // Unique violation - trying to insert duplicate key
    case "23505":
      return createApiResponseBody(
        HttpStatus.CONFLICT,
        "A resource with the same unique identifier already exists.",
      );

    // Foreign key violation - invalid relation
    case "23503":
      return createApiResponseBody(
        HttpStatus.BAD_REQUEST,
        "Invalid input syntax. Please check the foreign key.",
      );

    // Not-null violation - required field is null
    case "23502":
      return createApiResponseBody(
        HttpStatus.BAD_REQUEST,
        "A required field is missing. Please provide all necessary data.",
      );

    // Check constraint violation - business rule failed
    case "23514":
      return createApiResponseBody(
        HttpStatus.BAD_REQUEST,
        "Input data failed to meet the required conditions.",
      );

    // Invalid text representation (e.g. passing string to int)
    case "22P02":
      return createApiResponseBody(
        HttpStatus.BAD_REQUEST,
        "Invalid input syntax. Please ensure the data is correctly formatted.",
      );

    // Numeric value out of range
    case "22003":
      return createApiResponseBody(
        HttpStatus.BAD_REQUEST,
        "Invalid input syntax. Please ensure the data is correctly formatted.",
      );

    // Division by zero
    case "22012":
      return createApiResponseBody(
        HttpStatus.BAD_REQUEST,
        "Invalid operation: division by zero.",
      );

    // Insufficient privilege
    case "42501":
      return createApiResponseBody(
        HttpStatus.FORBIDDEN,
        "You do not have permission to perform this action.",
      );

    // Undefined column
    case "42703":
      return createApiResponseBody(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "A required field was not found in the database. Please contact support.",
      );

    default:
      Logger.log(`An unexpected database error occurred`, exception.cause);
      return createApiResponseBody(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "An unexpected database error occurred. Please contact support.",
      );
  }
}
