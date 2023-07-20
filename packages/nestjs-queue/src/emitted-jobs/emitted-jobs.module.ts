import { Module } from '@nestjs/common';
import { registerEmittedJobModel } from './emitted-job.schema';
import { EmittedJobsService } from './emitted-jobs.service';

const EmittedJobModel = registerEmittedJobModel();

@Module({
  imports: [EmittedJobModel],
  providers: [EmittedJobsService],
  exports: [EmittedJobModel, EmittedJobsService]
})
export class EmittedJobsModule {}
