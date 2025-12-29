import { pgTable, bigint, text, timestamp, index, integer } from 'drizzle-orm/pg-core';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { categories } from './categories-schema';

export const posts = pgTable(
  'posts',
  {
    post_id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    title: text().notNull(),
    content: text().notNull(),
    category_id: bigint('category_id', { mode: 'number' }).references(
      (): AnyPgColumn => categories.category_id,
      { onDelete: 'cascade' },
    ),
    view_count: bigint({ mode: 'number' }).notNull().default(0),
    read_time: integer().notNull(),
    tag_id: bigint({ mode: 'number' }).references((): AnyPgColumn => categories.category_id, {
      onDelete: 'cascade',
    }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    index('posts_tag_idx').on(table.category_id),
    index('posts_category_idx').on(table.tag_id),
  ],
);
