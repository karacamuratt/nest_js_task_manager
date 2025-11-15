import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Logger } from '@nestjs/common';

@Resolver()
export class TaskResolver {
  private readonly logger = new Logger(TaskResolver.name);

  constructor(@InjectQueue('task-queue') private taskQueue: Queue) {}

  @Mutation(() => String)
  async enqueueReportProcessing(
    @Args('reportId') reportId: string,
  ): Promise<string> {
    
    this.logger.log(`Adding a new task to the queue: PROCESS_REPORT`);

    // Add the task to the queue (we send the report ID as the payload here)
    const job = await this.taskQueue.add(
      'PROCESS_REPORT',
      { 
        type: 'PROCESS_REPORT', 
        payload: { reportId } 
      },
      {
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 3,
      }
    );
    
    // Respond to the user immediately here
    return `Report processing task successfully added to queue. Task ID: ${job.id}`;
  }
}
