import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as fs from "fs";

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync("src/private-key.pem"),
    cert: fs.readFileSync("src/certificate.pem"),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableCors();
  await app.listen(8000);
}
bootstrap();
