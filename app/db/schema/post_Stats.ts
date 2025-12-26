import { bigint, date, index, pgTable, type AnyPgColumn } from 'drizzle-orm/pg-core';
import { posts } from './posts-schema';
import { categories } from './categories-schema';

export const postStats = pgTable(
  'post_stats',
  {
    stat_id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    post_id: bigint({ mode: 'number' }).references((): AnyPgColumn => posts.post_id, {
      onDelete: 'cascade',
    }),
    category_id: bigint('category_id', { mode: 'number' }).references(
      (): AnyPgColumn => categories.category_id,
      {
        onDelete: 'cascade',
      },
    ),
    daily_view_count: bigint({ mode: 'number' }).notNull().default(0),
    record_date: date().notNull(),
  },
  (table) => [
    index('post_stats_record_date_idx').on(table.record_date),
    index('post_stats_category_id_idx').on(table.category_id),
  ],
);
