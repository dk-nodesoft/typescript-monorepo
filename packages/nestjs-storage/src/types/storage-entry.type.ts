import { z } from 'zod';

const StorageEntry = z.object({
  tenantId: z.string(),
  cuid: z.string().cuid2(),
  storagePath: z.string(),
  contentType: z.string(),
  crc: z.string(),
  createdAt: z.date().default(() => new Date()),
  expiresAt: z.date().optional(),
  signature: z.string(),
  metadata: z.record(z.any()).optional()
});

export type StorageEntry = z.infer<typeof StorageEntry>;
