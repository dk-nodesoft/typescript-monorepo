import type { CreateEmittedJobDto } from '../emitted-jobs';
import type { SkipFilterFn, TransformPayloadFn } from '../types';

export const defaultTranformPayloadFn: TransformPayloadFn = (dto: CreateEmittedJobDto) => ({ ...dto });
export const defaultSkipFilterFn: SkipFilterFn = (_dto: CreateEmittedJobDto) => false;
export const defaultCleanUpAfter = 30; // Default is 30 days
