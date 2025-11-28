import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common'; // <--- Importar

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // Usar el ValidationPipe globalmente
  app.useGlobalPipes(new ValidationPipe()); // <--- Añadir esta línea

  await app.listen(3001);
}
bootstrap();