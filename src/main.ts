import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { getQueueToken } from '@nestjs/bullmq';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverAdapter = new ExpressAdapter();

  serverAdapter.setBasePath('/bull-board');

  const taskQueue = app.get(getQueueToken('task-queue'));

  createBullBoard({
    queues: [new BullMQAdapter(taskQueue)],
    serverAdapter,
  });

  app.use('/bull-board', serverAdapter.getRouter());

  await app.listen(3000);
}

bootstrap();
