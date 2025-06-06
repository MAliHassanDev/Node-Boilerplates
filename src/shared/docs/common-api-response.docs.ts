import { applyDecorators } from "@nestjs/common";
import { ApiQuery, ApiResponse, ApiResponseOptions } from "@nestjs/swagger";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface.js";

type CommonHttpStatusKeys =
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "CONFLICT"
  | "INTERNAL_SERVER_ERROR";

export const getApiResponseSwaggerSchemaObject = (
  statusCode: number,
  message: string,
  data: SchemaObject = {
    type: "object",
    nullable: true,
    example: null,
  },
) => {
  return {
    type: "object",
    properties: {
      statusCode: { type: "number", example: statusCode },
      message: { type: "string", example: message },
      data: data,
    },
  };
};

export const commonApiResponseOptions: Record<
  CommonHttpStatusKeys,
  ApiResponseOptions
> = {
  BAD_REQUEST: {
    status: 400,
    description: "Bad Request - Invalid data provided",
    schema: getApiResponseSwaggerSchemaObject(400, "Validation failed", {
      type: "object",
      properties: {
        field: { type: "string" },
        message: { type: "string" },
      },
      example: { email: "Invalid email", password: "Password is required" },
    }),
  },
  FORBIDDEN: {
    status: 403,
    description: "Forbidden - User does not have permission to access resource",
    schema: getApiResponseSwaggerSchemaObject(
      403,
      "You do not have the required permissions to access this resource",
    ),
  },
  NOT_FOUND: {
    status: 404,
    description: "Not Found - Record with given input does not exist",
    schema: getApiResponseSwaggerSchemaObject(404, "Record not found"),
  },
  CONFLICT: {
    status: 409,
    description: "Conflict - Updated details conflict with existing record",
    schema: getApiResponseSwaggerSchemaObject(
      409,
      "Record with these details already exists",
    ),
  },

  INTERNAL_SERVER_ERROR: {
    status: 500,
    description: "Internal Server Error",
    schema: getApiResponseSwaggerSchemaObject(500, "Internal server error"),
  },
} as const;

export function useCommonCreateResourceApiResponses(
  ...decorators: Array<MethodDecorator | ClassDecorator | PropertyDecorator>
) {
  return applyDecorators(
    ApiResponse(commonApiResponseOptions.BAD_REQUEST),
    ApiResponse(commonApiResponseOptions.NOT_FOUND),
    ApiResponse(commonApiResponseOptions.CONFLICT),
    ApiResponse(commonApiResponseOptions.FORBIDDEN),
    ApiResponse(commonApiResponseOptions.INTERNAL_SERVER_ERROR),
    ...decorators,
  );
}

export function useCommonListResourceDocs(
  ...decorators: Array<MethodDecorator | ClassDecorator | PropertyDecorator>
) {
  return applyDecorators(
    ApiQuery({
      name: "limit",
      required: false,
      description: "Maximum number of items to retrieve",
      type: Number,
      example: 10,
    }),
    ApiQuery({
      name: "offset",
      required: false,
      description: "Number of items to skip",
      type: Number,
      example: 1,
    }),
    ApiResponse(commonApiResponseOptions.FORBIDDEN),
    ApiResponse(commonApiResponseOptions.INTERNAL_SERVER_ERROR),
    ...decorators,
  );
}
