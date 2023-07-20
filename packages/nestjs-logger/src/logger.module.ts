import { CONFIG_LOG_LEVEL, ConfigModule, ConfigService } from '@dk-nodesoft/nestjs-config';
import { Module } from '@nestjs/common';
import { ClsModule, ClsService } from 'nestjs-cls';
import { LoggerModule as LoggerModulePino } from 'nestjs-pino';
import {
  httpLoggerCustomAttributeKeys,
  httpLoggerCustomProps,
  httpLoggerCustomReceivedMessage,
  httpLoggerCustomSuccessMessage,
  httpLoggerGenReqId,
  setupLoggerMixin
} from './logger.mixin';
import { LoggerService } from './logger.service';

@Module({
  providers: [LoggerService, ClsService],
  imports: [
    LoggerModulePino.forRootAsync({
      imports: [ConfigModule, ClsModule],
      inject: [ConfigService, ClsService],
      useFactory: (config: ConfigService, cls: ClsService) => ({
        pinoHttp: {
          level: config.get(CONFIG_LOG_LEVEL),
          mixin: setupLoggerMixin(cls),
          customProps: httpLoggerCustomProps,
          customAttributeKeys: httpLoggerCustomAttributeKeys,
          genReqId: httpLoggerGenReqId,
          customReceivedMessage: httpLoggerCustomReceivedMessage,
          customSuccessMessage: httpLoggerCustomSuccessMessage
        }
      })
    })
  ],
  exports: [LoggerService]
})
export class LoggerModule {}
