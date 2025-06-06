import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module.js";
import { Logger } from "@nestjs/common";
import { setupSwaggerDocumentation } from "./shared/middlewares/swagger-setup.middleware.js";
import cookieParser from "cookie-parser";
import { TransformSuccessResponseInterceptor } from "./shared/interceptors/transformApiResponse.interceptor.js";
import { useRequestLogging } from "./shared/middlewares/request-logger.middleware.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });

  // set global prefix for all routes
  app.setGlobalPrefix("/api/v1");

  // set express cookie parser
  app.use(cookieParser());

  // set up global middlewares
  setupSwaggerDocumentation(app);
  useRequestLogging(app);

  // set up global interceptors
  app.useGlobalInterceptors(new TransformSuccessResponseInterceptor());

  // start the server
  await app.listen(process.env.PORT ?? 3000, process.env.HOST ?? "0.0.0.0");

  Logger.log(`Server listening at ${await app.getUrl()}`, "Main");
}

void bootstrap();
