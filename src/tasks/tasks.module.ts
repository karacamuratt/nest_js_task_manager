import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TaskProcessor } from './task.processor';
import { TaskResolver } from './tasks.resolver';
import { TaskGateway } from './task.gateway';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'task-queue',
    }),
  ],
  controllers: [],
  providers: [TaskProcessor, TaskResolver, TaskGateway],
  exports: [BullModule, TaskGateway]
})

export class TasksModule {}
