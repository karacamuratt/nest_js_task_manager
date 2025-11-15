import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

interface TaskStatusPayload {
  taskId: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
  result?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class TaskGateway {
  private readonly logger = new Logger(TaskGateway.name);

  @WebSocketServer() server: Server;

  sendTaskStatusUpdate(payload: TaskStatusPayload) {
    this.logger.log(`[WS] Task status updated: ${payload.taskId} -> ${payload.status}`);
    this.server.emit('taskStatus', payload); 
  }
}
