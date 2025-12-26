import { bigint, pgEnum, pgTable, timestamp, type AnyPgColumn } from 'drizzle-orm/pg-core';
import { posts } from './posts-schema';

export const eventTypes = pgEnum('event_types', ['create', 'update'] as const);

export const events = pgTable('events', {
  event_id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  event_type: eventTypes('event_type').notNull(),
  post_id: bigint({ mode: 'number' }).references((): AnyPgColumn => posts.post_id, {
    onDelete: 'cascade',
  }),
  created_at: timestamp().notNull().defaultNow(),
});
