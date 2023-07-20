import { negate } from 'lodash';

import { isEmpty } from './isEmpty';

export const isNotEmpty = negate(isEmpty);
