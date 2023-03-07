import { Worker } from 'bullmq';
import eventWorker from './bootstrap';

const worker = new Worker(
  'event',
  eventWorker.process.bind(eventWorker),
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT!, 10),
    },
    concurrency: 1,
  },
);

worker.on('completed', (job) => console.info(
  `Completed job ${job.id} successfully.`,
));

worker.on('failed', (job, err) => console.error(`Failed job ${job?.id} with ${err}`));
