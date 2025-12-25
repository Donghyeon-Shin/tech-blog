import { pgTable, bigint, text, timestamp, index } from 'drizzle-orm/pg-core';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';

export const categories = pgTable(
  'categories',
  {
    category_id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    parent_id: bigint('parent_id', { mode: 'number' }).references(
      (): AnyPgColumn => categories.category_id,
      { onDelete: 'cascade' },
    ),
    sort_order: bigint({ mode: 'number' }).notNull().default(0),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [index('parent_idx').on(table.parent_id)],
);
