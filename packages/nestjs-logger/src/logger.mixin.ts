import { isPlainObject, isString } from '@dk-nodesoft/ts-utils';
import { createId } from '@paralleldrive/cuid2';
import type { Request } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import type { ClsService } from 'nestjs-cls';
import { ClsServiceManager } from 'nestjs-cls';

export const CONTEXT_REQUEST_ID = 'request:requestId';
export const CONTEXT_OWNER_ID = 'request:ownerId';

// TODO: Provide mapping for nestjs cls services
export const setupLoggerMixin = (cls: ClsService): (() => Record<string, any>) => {
  return (): Record<string, any> => {
    const ret: { requestId?: string; ownerId?: string } = {};

    const requestId = cls.get(CONTEXT_REQUEST_ID);
    const ownerId = cls.get(CONTEXT_OWNER_ID);

    ret.requestId = requestId;
    ret.ownerId = ownerId;

    return ret;
  };
};

const formatRequestPayload = (req: Request): string => {
  if (isPlainObject(req.body)) {
    return JSON.stringify({ ...req.body, ...req.query });
  }

  if (isString(req.body)) {
    return req.body;
  }

  return JSON.stringify(req.query);
};

export const httpLoggerCustomProps = (req: IncomingMessage, _res: ServerResponse): object => {
  const requestPayload = formatRequestPayload(req as Request);
  const endpoint = (req as Request).params?.['0'];

  return {
    context: 'accessLog',
    requestPayload,
    endpoint
  };
};

export const httpLoggerCustomAttributeKeys = {
  req: 'request',
  res: 'response',
  err: 'error',
  responseTime: 'timeTaken'
};

export const httpLoggerCustomReceivedMessage = (_req: IncomingMessage, _res: ServerResponse): string => {
  return `Request received`;
};

export const httpLoggerCustomSuccessMessage = (_req: IncomingMessage, _res: ServerResponse): string => {
  return 'Request completed';
};

export const httpLoggerGenReqId = (_req: IncomingMessage): string => {
  const cls = ClsServiceManager.getClsService();
  return cls.getId() || createId();
};
