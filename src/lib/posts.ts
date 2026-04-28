import { supabase } from "./supabase";
import type { Post } from "@/types";

export async function getPosts(tag?: string) {
  let query = supabase
    .from("posts")
    .select("*, match_requests(count)")
    .order("is_boosted", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(20);

  if (tag && tag !== "전체") {
    query = query.contains("tags", [tag]);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data as (Post & { match_requests: { count: number }[] })[]).map((p) => ({
    ...p,
    match_count: p.match_requests?.[0]?.count ?? 0,
  }));
}

export async function searchPosts(query: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .or(`location_name.ilike.%${query}%,body.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return data as Post[];
}

// 전체 실제 글 수 조회
export async function getTotalPostCount() {
  const { count, error } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
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
