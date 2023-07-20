import { OopsError } from '@dk-nodesoft/base-exceptions';
import type { QueueName, Topic, TopicName, TopicOptions, TopicPayload } from '../types';
import { defaultCleanUpAfter, defaultSkipFilterFn, defaultTranformPayloadFn } from './defaults';

export class Topics {
  private static instance: Topics;

  private registeredTopics: Record<TopicName, any> = {};

  public static getInstance(): Topics {
    if (!Topics.instance) {
      Topics.instance = new Topics();
    }

    return Topics.instance;
  }

  public registerTopic<T extends TopicPayload = TopicPayload>(
    topic: TopicName,
    queue: QueueName,
    options?: TopicOptions
  ): void {
    if (this.hasTopic(topic)) {
      return;
      //  throw new OopsError({ message: `Queue emitter topic already defined`, details: { topic } });
    }

    const transformPayload = options?.transformPayload || defaultTranformPayloadFn;
    const skipFilter = options?.skipFilter || defaultSkipFilterFn;
    const cleanUpAfter = options?.cleanUpAfter || defaultCleanUpAfter;

    const newTopic: Topic<T> = {
      topic,
      queue,
      jobOptions: { ...options?.jobOptions, ...{} },
      transformPayload,
      skipFilter,
      cleanUpAfter
    };

    this.registeredTopics[topic] = newTopic;
  }

  public hasTopic(topic: TopicName): boolean {
    return !!this.registeredTopics[topic];
  }

  public getTopic<U extends Topic = Topic>(topic: TopicName): U {
    if (!this.hasTopic(topic)) {
      throw new OopsError({ message: `Queue emitter topic not defined`, details: { topic } });
    }

    return this.registeredTopics[topic] as U;
  }

  public getTopics(): TopicName[] {
    return Object.keys(this.registeredTopics);
  }
}
