import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const basicApiApp = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3400;
  await basicApiApp.listen(port);
  const mqUser = process.env.CONSUMER_USERNAME;
  const mqPw = process.env.CONSUMER_PASSWORD;
  const queueUrl = process.env.QUEUE_AWS_URL;
  const queuePort = process.env.QUEUE_AWS_PORT;
  // sdd
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqps://${mqUser}:${mqPw}@${queueUrl}:${queuePort}`],
      queue: 'rentals',
      // false = manual acknowledgement; true = automatic acknowledgment
      noAck: false,
      // Get one by one
      prefetchCount: 1,
    },
  });
  await app.listen();
}
bootstrap().then();
