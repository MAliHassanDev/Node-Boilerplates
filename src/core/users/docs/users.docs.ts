import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { useCommonCreateResourceApiResponses } from "../../../shared/docs/common-api-response.docs.js";

export function ApiDocCreateUser() {
  return useCommonCreateResourceApiResponses(
    ApiOperation({
      summary: "Create a new user",
      description: "Create a new user",
    }),

    ApiResponse({
      status: 201,
      description: "User created",
      type: Object,
    }),
  );
}
