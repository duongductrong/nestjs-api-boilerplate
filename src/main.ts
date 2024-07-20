import { NestFactory, Reflector } from "@nestjs/core";

import { ClassSerializerInterceptor, INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { useContainer } from "class-validator";
import { config as envConfig } from "dotenv";
import { initializeTransactionalContext } from "typeorm-transactional";
import { consola } from "consola";
import { AppModule } from "./app.module";

envConfig();

function setupSwagger(app: INestApplication<any>, prefix = "docs") {
  const config = new DocumentBuilder()
    .setTitle("Document API")
    .setDescription("The summary document api")
    .setVersion("1.0")
    .addBearerAuth({ type: "apiKey", in: "header", name: "Authorization" })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  consola.info(
    "Swagger running at: " +
      `http://localhost:${process.env.APP_PORT}/${prefix}`,
  );

  SwaggerModule.setup(prefix, app, document);
}

async function bootstrap() {
  initializeTransactionalContext();

  const appPrefix = process.env.APP_PREFIX || "/";

  const app = await NestFactory.create(AppModule);

  // Application config
  app.setGlobalPrefix(appPrefix);

  // Cors config
  app.enableCors({
    origin: process.env.APP_CORS.split(",").map((i) => i.trim()),
  });

  // Class serializer config
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Class transformer config
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  setupSwagger(app);

  consola.info(
    "Server running at port: " +
      `http://localhost:${process.env.APP_PORT}/${appPrefix}`,
  );

  await app.listen(process.env.APP_PORT || 3000);
}

bootstrap();
