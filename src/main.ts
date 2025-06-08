import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app/app.module.js";
import { ClassSerializerInterceptor, Logger } from "@nestjs/common";
import { setupSwaggerDocumentation } from "./shared/middlewares/swagger-setup.middleware.js";
import cookieParser from "cookie-parser";
import { TransformSuccessResponseInterceptor } from "./shared/interceptors/transformApiResponse.interceptor.js";
import { useRequestLogging } from "./shared/middlewares/request-logger.middleware.js";
import { useValidationPipe } from "./shared/pipes/use-validation-pipe.js";
import { AllExceptionFilter } from "./shared/filters/all-exception.filter.js";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable cors
  app.enableCors();

  // set global prefix for all routes
  app.setGlobalPrefix("/v1");

  // set express cookie parser
  app.use(cookieParser());

  // use helmet for security
  app.use(helmet());

  // set up global middlewares
  setupSwaggerDocumentation(app);
  useRequestLogging(app);

  // set up global interceptors
  app.useGlobalInterceptors(new TransformSuccessResponseInterceptor());
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  // set up global pipes
  useValidationPipe(app);

  // set up global filters
  app.useGlobalFilters(new AllExceptionFilter());

  // start the server
  await app.listen(process.env.PORT ?? 3000, process.env.HOST ?? "0.0.0.0");

  Logger.log(`Server listening at ${await app.getUrl()}`, "Main");
}

void bootstrap();
