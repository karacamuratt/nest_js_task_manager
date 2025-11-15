import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    console.log('PrismaService: MongoDB connected successfully...');
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
        await this.$disconnect();
        await app.close();
    });
  }
}
