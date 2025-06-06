import { INestApplication, Logger } from "@nestjs/common";

import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

/**
 * Configure and initialize Swagger/OpenAPI documentation
 * @param app NestJS application instance
 */
export function setupSwaggerDocumentation(app: INestApplication) {
  // Define API metadata and configuration options
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Ebridge API")
    .setDescription(
      `
      Complete API documentation for the Ebridge platform.

      This API provides endpoints for managing packages, users, and other core business entities.
      All protected routes require authentication via Bearer token obtained from the auth endpoints.

      ## Environment Information
      - **Current Version**: 1.0.0
      - **Base URL**: ${process.env.API_BASE_URL ?? "https://example.com"}
      - **Environment**: ${process.env.NODE_ENV ?? "development"}
    `,
    )
    .setVersion("1.0.0")
    .addServer(
      process.env.API_BASE_URL ?? "https://example.com",
      "Production Server",
    )
    .addServer("https://example-api.com", "Staging Server")
    .addServer("http://192.168.100.4:3000", "Local Development")
    .setContact(
      "Nestjs Boilerplate API Support",
      "https://example.com/support",
      "api-support@example.com",
    )
    .setLicense("Proprietary", "https://example.com/terms")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description: "Enter JWT token",
        in: "header",
      },
      "access-token",
    )
    .addTag(
      "Authentication",
      "Endpoints for user authentication and token management",
    )
    .addTag(
      "Health Check",
      "Endpoints for checking the API's health and status",
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    extraModels: [], // Add any additional DTOs that need to be included in schema definitions
  });

  // Setup the Swagger UI endpoint
  SwaggerModule.setup("/docs", app, swaggerDocument, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: "none",
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      deepLinking: true,
      displayOperationId: false,
      displayRequestDuration: true,
      tryItOutEnabled: false,
    },
    customSiteTitle: "Nestjs Boilerplate API Documentation",
    customfavIcon: "https://google.com/favicon.ico",
  });

  Logger.log(
    `Swagger documentation is available at ${process.env.API_BASE_URL ?? "http://localhost:3000"}/docs`,
  );
}
