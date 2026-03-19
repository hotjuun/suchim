// 스침 핵심 데이터 타입

export interface Post {
  id: string;
  created_at: string;
  user_id: string;
  location_name: string; // "합정 카페 어니언"
  location_lat?: number;
  location_lng?: number;
  date_text: string; // "오늘 (3/19)"
  time_text: string; // "오후 3시경"
  body: string; // 상황 묘사 글
  tags: string[]; // ["카페", "오후"]
  is_boosted: boolean;
  boost_expires_at?: string;
}

export interface MatchRequest {
  id: string;
  created_at: string;
  post_id: string;
  requester_id: string; // "저인 것 같아요" 누른 사람
  message: string; // 확인 메시지
  status: "pending" | "accepted" | "declined";
}

export interface ChatRoom {
  id: string;
  created_at: string;
  post_id: string;
  match_request_id: string;
  user1_id: string; // 글쓴이
  user2_id: string; // 응답자
}

export interface ChatMessage {
  id: string;
  created_at: string;
  room_id: string;
  sender_id: string;
  content: string;
}

// UI용 합성 타입
export interface PostWithMeta extends Post {
  match_count: number;
  time_ago: string; // "오늘 3시", "어제", "3일 전"
}

export interface MatchWithPost extends MatchRequest {
  post: PostWithMeta;
  requester_emoji: string; // 익명 이모지 아바타
  requester_label: string; // "익명의 스침 #4782"
}
