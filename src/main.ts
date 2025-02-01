import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module.js";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // build swagger open api docs
  const config = new DocumentBuilder()
    .setTitle("AceBeauty api")
    .setDescription("Api documentation for AceBeauty club")
    .setVersion("1.0")
    .addTag("aceBeauty")
    .build();
  const swaggerFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/docs", app, swaggerFactory);

  // start the server
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
