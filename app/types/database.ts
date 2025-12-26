import type { Database as SupabaseDatabase } from '../../database.types.ts';
import type { MergeDeep, SetNonNullable } from 'type-fest';

export type Database = MergeDeep<
  SupabaseDatabase,
  {
    public: {
      Views: {
        posts_with_excerpt: {
          Row: SetNonNullable<SupabaseDatabase['public']['Views']['posts_with_excerpt']['Row']>;
        };
      };
    };
  }
>;
