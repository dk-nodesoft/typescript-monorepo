import { BullModule } from '@nestjs/bull';
import { QUEUE_SMS } from './sms.queue';

export const jobListenersQueues = BullModule.registerQueue({
  name: QUEUE_SMS.name,
  ...QUEUE_SMS.options
});
