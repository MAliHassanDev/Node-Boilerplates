import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module.js";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // build swagger open api docs
  const config = new DocumentBuilder()
    .setTitle("Nestjs Boilerplate")
    .setDescription("Api documentation for Example.com")
    .setVersion("1.0")
    .build();
  const swaggerFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/docs", app, swaggerFactory);

  // set global prefix for all routes
  app.setGlobalPrefix("/api/v1");

  // start the server
  await app.listen(process.env.PORT ?? 3000);

  Logger.log(`Server listening at ${await app.getUrl()}`, "Main");
}

void bootstrap();
