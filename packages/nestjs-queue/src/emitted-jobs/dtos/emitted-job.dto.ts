import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import type { TopicData } from '../../types';
import { EmittedJobContext, EmittedJobId, EmittedJobStatus } from '../emitted-job.types';

export class EmittedJobDto<T extends TopicData = TopicData> {
  @IsString()
  id!: EmittedJobId;

  @IsString()
  @IsNotEmpty()
  readonly topic!: string;

  @IsOptional()
  readonly data!: T;

  @IsOptional()
  readonly context!: EmittedJobContext;

  @IsNotEmpty()
  status!: EmittedJobStatus;

  @IsNumber()
  progress!: number;

  @IsString()
  hash!: string;
}
