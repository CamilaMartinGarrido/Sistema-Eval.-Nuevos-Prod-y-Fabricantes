import { NestFactory, PartialGraphHost } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    abortOnError: false,   // obligatorio según la guía
  });

  await app.listen(process.env.PORT ? +process.env.PORT : 3000);
  console.log('Server running on port', process.env.PORT || 3000);
}

bootstrap().catch((err) => {
  fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '');
  process.exit(1);
});
