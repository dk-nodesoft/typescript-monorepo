import { Module } from '@nestjs/common';
import { EmittedJobsModule } from './emitted-jobs/emitted-jobs.module';
import { jobListenersQueues } from './queues';
import { QueuesService } from './queues.service';

@Module({
  imports: [EmittedJobsModule, jobListenersQueues],
  providers: [QueuesService],
  exports: [EmittedJobsModule, QueuesService]
})
export class QueuesModule {}
