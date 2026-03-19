import { supabase } from "./supabase";
import type { Post } from "@/types";

export async function getPosts(location?: string) {
  let query = supabase
    .from("posts")
    .select("*")
    .order("is_boosted", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(20);

  if (location && location !== "내 주변") {
    query = query.ilike("location_name", `%${location}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Post[];
}

export async function createPost(post: {
  user_id: string;
  location_name: string;
  date_text: string;
  time_text: string;
  body: string;
  tags: string[];
}) {
  const { data, error } = await supabase
    .from("posts")
    .insert(post)
    .select()
    .single();
  if (error) throw error;
  return data as Post;
}

export async function deletePost(postId: string) {
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw error;
}
