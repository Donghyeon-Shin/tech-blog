export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          category_id: number
          created_at: string
          name: string
          parent_id: number | null
          sort_order: number
        }
        Insert: {
          category_id?: never
          created_at?: string
          name: string
          parent_id?: number | null
          sort_order?: number
        }
        Update: {
          category_id?: never
          created_at?: string
          name?: string
          parent_id?: number | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_categories_category_id_fk"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          event_id: number
          event_type: Database["public"]["Enums"]["event_types"]
          post_id: number | null
        }
        Insert: {
          created_at?: string
          event_id?: never
          event_type: Database["public"]["Enums"]["event_types"]
          post_id?: number | null
        }
        Update: {
          created_at?: string
          event_id?: never
          event_type?: Database["public"]["Enums"]["event_types"]
          post_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "events_post_id_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "events_post_id_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_excerpt"
            referencedColumns: ["post_id"]
          },
        ]
      }
      post_stats: {
        Row: {
          category_id: number | null
          daily_view_count: number
          post_id: number | null
          record_date: string
          stat_id: number
        }
        Insert: {
          category_id?: number | null
          daily_view_count?: number
          post_id?: number | null
          record_date: string
          stat_id?: never
        }
        Update: {
          category_id?: number | null
          daily_view_count?: number
          post_id?: number | null
          record_date?: string
          stat_id?: never
        }
        Relationships: [
          {
            foreignKeyName: "post_stats_category_id_categories_category_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "post_stats_post_id_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_stats_post_id_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_excerpt"
            referencedColumns: ["post_id"]
          },
        ]
      }
      posts: {
        Row: {
          category_id: number | null
          content: string
          created_at: string
          post_id: number
          read_time: number
          tag: number | null
          title: string
          view_count: number
        }
        Insert: {
          category_id?: number | null
          content: string
          created_at?: string
          post_id?: never
          read_time: number
          tag?: number | null
          title: string
          view_count?: number
        }
        Update: {
          category_id?: number | null
          content?: string
          created_at?: string
          post_id?: never
          read_time?: number
          tag?: number | null
          title?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "posts_category_id_categories_category_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "posts_tag_categories_category_id_fk"
            columns: ["tag"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
    }
    Views: {
      posts_with_excerpt: {
        Row: {
          category_id: number | null
          created_at: string | null
          excerpt: string | null
          post_id: number | null
          read_time: number | null
          tag: number | null
          title: string | null
          view_count: number | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          excerpt?: never
          post_id?: number | null
          read_time?: number | null
          tag?: number | null
          title?: string | null
          view_count?: number | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          excerpt?: never
          post_id?: number | null
          read_time?: number | null
          tag?: number | null
          title?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_category_id_categories_category_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "posts_tag_categories_category_id_fk"
            columns: ["tag"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
    }
    Functions: {
      get_latest_unique_events: {
        Args: never
        Returns: {
          created_at: string
          event_id: number
          event_type: Database["public"]["Enums"]["event_types"]
          post_excerpt: string
          post_id: number
          post_title: string
        }[]
      }
      increment_post_view: { Args: { post_id: number }; Returns: undefined }
    }
    Enums: {
      event_types: "create" | "update"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      event_types: ["create", "update"],
    },
  },
} as const
