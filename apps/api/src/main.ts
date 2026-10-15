import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Handled conditionally by AppModule's SelectiveBodyParserMiddleware
  });

  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? '0.0.0.0';
  await app.listen(port, host);
  console.log(`[API Server] Running on http://${host}:${port}`);
}
await bootstrap();
