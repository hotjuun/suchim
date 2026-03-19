// MVP 개발용 목업 데이터 — Supabase 연동 전까지 사용
import type { PostWithMeta, MatchWithPost } from "@/types";

export const mockPosts: PostWithMeta[] = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    user_id: "u1",
    location_name: "합정 카페 어니언",
    date_text: "오늘 (3/19)",
    time_text: "오후 3시경",
    body: "창가 자리에서 맥북으로 작업하고 계셨던 분. 검은 니트에 안경 쓰셨고, 가끔 창밖을 보실 때마다 눈이 마주쳤어요. 말을 걸고 싶었는데 용기가 나지 않아서...",
    tags: ["카페", "오후"],
    is_boosted: true,
    match_count: 0,
    time_ago: "오늘 3시",
  },
  {
    id: "2",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    user_id: "u2",
    location_name: "2호선 홍대입구역",
    date_text: "어제",
    time_text: "오전 8시반",
    body: "출근길 2호선, 같은 칸 문 앞에 서 계셨어요. 베이지 코트에 에어팟 끼고 계셨고, 내릴 때 살짝 미소 지어주신 거... 제가 착각한 건 아니겠죠?",
    tags: ["지하철", "출근길"],
    is_boosted: false,
    match_count: 0,
    time_ago: "어제",
  },
  {
    id: "3",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    user_id: "u3",
    location_name: "성수 서울숲",
    date_text: "3일 전",
    time_text: "오후 5시경",
    body: "서울숲 산책로에서 골든 리트리버 산책시키고 계셨던 분. 저도 비숑 데리고 있었는데 강아지들이 서로 인사하다가 잠깐 얘기 나눴었어요. 더 이야기하고 싶었는데...",
    tags: ["공원", "반려견"],
    is_boosted: false,
    match_count: 0,
    time_ago: "3일 전",
  },
  {
    id: "4",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    user_id: "u4",
    location_name: "연남동 연트럴파크",
    date_text: "5일 전",
    time_text: "오후 7시경",
    body: "벤치에서 기타 치고 계셨던 분. 지나가다 멈춰서 한참 듣고 있었는데, 연주 끝나고 눈이 마주쳤을 때 고개 숙여 인사해주셨죠. 그 곡 제목이 뭐였는지 너무 궁금해요.",
    tags: ["음악", "저녁"],
    is_boosted: false,
    match_count: 0,
    time_ago: "5일 전",
  },
];

export const mockMatches: MatchWithPost[] = [
  {
    id: "m1",
    created_at: new Date(Date.now() - 1800000).toISOString(),
    post_id: "1",
    requester_id: "u5",
    message:
      "맞아요, 저 그때 어니언에서 작업하고 있었어요. 검은 니트에 안경... 맞는 것 같아요. 저도 눈이 마주쳤던 기억이 나요 😊",
    status: "pending",
    post: mockPosts[0],
    requester_emoji: "🌿",
    requester_label: "익명의 스침 #4782",
  },
];

export const mockChats = [
  {
    id: "c1",
    emoji: "🌸",
    label: "성수 서울숲 · #3291",
    lastMessage: "혹시 이번 주말에도 산책 나오시나요?",
    time: "5분 전",
    unread: 1,
  },
];

export const LOCATION_TABS = ["내 주변", "합정", "강남", "성수", "홍대", "을지로"];

export const TAG_OPTIONS = [
  "카페", "지하철", "서점", "헬스장", "공원", "식당", "오후", "출근길",
];
