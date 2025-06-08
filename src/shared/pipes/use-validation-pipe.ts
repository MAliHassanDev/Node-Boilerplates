import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from "@nestjs/common";
import { ApiResponse } from "../types/api-response.type.js";

export function useValidationPipe(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      forbidUnknownValues: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: errors => {
        const transformedErrorObject: Record<string, string> = errors.reduce(
          (acc, err) => {
            const field = err.property;
            const errorMessage = Object.values(err.constraints ?? {})[0];
            return {
              ...acc,
              [field]: errorMessage,
            };
          },
          {},
        );
        return new BadRequestException({
          statusCode: 400,
          message: "Validation failed",
          data: transformedErrorObject,
        } satisfies ApiResponse<Record<string, string>>);
      },
    }),
  );
}
