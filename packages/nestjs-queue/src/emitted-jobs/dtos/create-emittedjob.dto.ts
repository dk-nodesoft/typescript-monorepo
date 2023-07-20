import { lowerFirst } from '@dk-nodesoft/ts-utils';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import type { TopicData } from '../../types';
import { EmittedJobContext } from '../emitted-job.types';

export class CreateEmittedJobDto<T extends TopicData = TopicData> {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => lowerFirst(value))
  readonly topic!: string;

  @IsOptional()
  readonly data!: T;

  @IsOptional()
  readonly context!: EmittedJobContext;
}
