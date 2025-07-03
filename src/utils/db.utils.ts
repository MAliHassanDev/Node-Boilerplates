import {
  ConflictException,
  HttpException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { isPostgresException, PostgresException } from "./exception.utils.js";

export async function executeQueryTakeFirstOrThrow<T>(
  query: Promise<T[]>,
): Promise<T> {
  const result = await query;
  if (!result[0]) throw new Error("No record returned from  query");
  return result[0];
}

/*
 * Extracts the column name from the constraint detail message.
 * e.g "Key (cnic)=(039740934739) already exists." to "cnic"
 */
export function extractViolatedColumnFromUniqueConstraint(
  error: PostgresException,
): string | undefined {
  if (!error.cause.detail) return;

  return error.cause.detail.match(/(?<=Key \()[^)]+/g)?.[0];
}

interface HandleExceptionOptions {
  resource: string;
  messages?: {
    uniqueConstraintError?: string;
    foreignResourceNotFound?: string;
  };
}

export function handleDatabaseInsertException(
  error: unknown,
  options: HandleExceptionOptions,
): never {
  const logger = new Logger("Service Exception");

  if (error instanceof HttpException) {
    throw error;
  }

  if (!isPostgresException(error)) {
    logger.log("Non postgres error caught in exception handler", error);
    throw error;
  }

  switch (error.cause.code) {
    case "23505": {
      const constraintName = extractViolatedColumnFromUniqueConstraint(error);
      const message =
        options.messages?.uniqueConstraintError ??
        `${options.resource} with same ${constraintName ?? "details"} already exists`;
      throw new ConflictException(message);
    }
    case "23503": {
      const message =
        options.messages?.foreignResourceNotFound ?? error.cause.detail;
      throw new NotFoundException(message);
    }
    default:
      logger.log(
        "Unknown database error caught in database exception handler",
        error,
      );
      throw error;
  }
}
