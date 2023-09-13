export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      Comments: {
        Row: {
          author: string;
          content: string;
          created_at: string;
          id: number;
          post_id: number;
          reply_id: number | null;
        };
        Insert: {
          author: string;
          content: string;
          created_at?: string;
          id?: number;
          post_id: number;
          reply_id?: number | null;
        };
        Update: {
          author?: string;
          content?: string;
          created_at?: string;
          id?: number;
          post_id?: number;
          reply_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "Comments_post_id_fkey";
            columns: ["post_id"];
            referencedRelation: "Posts";
            referencedColumns: ["id"];
          },
        ];
      };
      Posts: {
        Row: {
          content: string | null;
          created_at: string;
          created_by: string | null;
          id: number;
          meta_description: string | null;
          meta_title: string | null;
          name: string | null;
          slug: string;
          tags: string[] | null;
          thumbnail: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: number;
          meta_description?: string | null;
          meta_title?: string | null;
          name?: string | null;
          slug: string;
          tags?: string[] | null;
          thumbnail?: string;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: number;
          meta_description?: string | null;
          meta_title?: string | null;
          name?: string | null;
          slug?: string;
          tags?: string[] | null;
          thumbnail?: string;
        };
        Relationships: [];
      };
      Tags: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
