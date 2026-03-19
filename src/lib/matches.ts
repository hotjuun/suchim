import { supabase } from "./supabase";
import type { MatchRequest } from "@/types";

export async function createMatchRequest(request: {
  post_id: string;
  requester_id: string;
  message: string;
}) {
  const { data, error } = await supabase
    .from("match_requests")
    .insert(request)
    .select()
    .single();
  if (error) throw error;
  return data as MatchRequest;
}

export async function getMyMatches(userId: string) {
  // 내가 쓴 글에 온 매칭 요청들
  const { data, error } = await supabase
    .from("match_requests")
    .select("*, post:posts(*)")
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function respondToMatch(
  matchId: string,
  accept: boolean,
  userId: string
) {
  const { data: match, error: matchError } = await supabase
    .from("match_requests")
    .update({ status: accept ? "accepted" : "declined" })
    .eq("id", matchId)
    .select("*, post:posts(*)")
    .single();

  if (matchError) throw matchError;

  // 수락하면 채팅방 생성
  if (accept && match) {
    const { error: roomError } = await supabase.from("chat_rooms").insert({
      post_id: match.post_id,
      match_request_id: match.id,
      user1_id: userId,
      user2_id: match.requester_id,
    });
    if (roomError) throw roomError;
  }

  return match;
}
