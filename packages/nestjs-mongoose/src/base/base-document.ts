import type { ObjectWithCuid } from '@dk-nodesoft/base-types';
import { createCuid, CuidString } from '@dk-nodesoft/ts-utils';
import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class BaseDocument extends Document implements ObjectWithCuid {
  @Prop({ default: createCuid, unique: true })
  cuid!: CuidString;
}
