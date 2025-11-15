import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { TaskGateway } from './task.gateway';

@Processor('task-queue')
export class TaskProcessor extends WorkerHost {
  private readonly logger = new Logger(TaskProcessor.name);

  constructor(private readonly taskGateway: TaskGateway) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Job (Job ID: ${job.id}) processing...`);
    this.logger.debug(`Job Data: ${JSON.stringify(job.data)}`);

    const { type, payload } = job.data;

    // START
    this.taskGateway.sendTaskStatusUpdate({
        taskId: job.id || '',
        status: 'ACTIVE',
    });

    try {
      switch (type) {
        case 'SEND_EMAIL':
          // SIMULATION EMAIL SENDING
          await new Promise(resolve => setTimeout(resolve, 5000));
          this.logger.log(`✅ E-posta sent successfully: ${payload.recipient}`);
          break;
          
        case 'PROCESS_REPORT':
          // SIMULATION REPORTING TASK
          await new Promise(resolve => setTimeout(resolve, 10000));
          this.logger.log(`✅ Report processed successfully: ${payload.reportId}`);
          break;

        default:
          this.logger.error(`Unknown task type: ${type}`);
          throw new Error(`Unknown task type: ${type}`);
      }

      // DONE
      this.taskGateway.sendTaskStatusUpdate({
          taskId: job.id || '',
          status: 'COMPLETED',
          result: 'Successfully processed.'
      });
      
      return { success: true, processedJobId: job.id };

    } catch (error) {
      // ERROR
      this.taskGateway.sendTaskStatusUpdate({
          taskId: job.id || '',
          status: 'FAILED',
          result: error.message
      });

      throw error;
    }
  }
}
