// 시드 데이터 + 탭/태그 설정
import type { PostWithMeta, MatchWithPost } from "@/types";

// 상황 태그 탭 (피드 상단 필터)
export const TAG_TABS = ["전체", "카페", "지하철", "공원", "서점", "헬스장", "식당", "야구장", "축제"];

// 글 작성 시 선택할 수 있는 태그
export const TAG_OPTIONS = [
  "카페", "지하철", "서점", "헬스장", "공원", "식당", "야구장", "축제", "콘서트", "출근길",
];

// 하위호환
export const LOCATION_TABS = TAG_TABS;

export const seedPosts: PostWithMeta[] = [
  // ── 카페 ──
  {
    id: "seed-1",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    user_id: "seed-u1",
    location_name: "합정 카페 어니언",
    date_text: "오늘",
    time_text: "오후 3시경",
    body: "창가 자리에서 맥북으로 작업하고 계셨던 분. 검은 니트에 안경 쓰셨고, 가끔 창밖을 보실 때마다 눈이 마주쳤어요. 말을 걸고 싶었는데 용기가 나지 않아서...",
    tags: ["카페"],
    is_boosted: true,
    match_count: 2,
    time_ago: "2시간 전",
  },
  {
    id: "seed-3",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    user_id: "seed-u3",
    location_name: "강남 스타벅스 역삼점",
    date_text: "오늘",
    time_text: "오전 11시경",
    body: "아메리카노 주문할 때 같이 줄 서 계셨던 분. 흰 셔츠에 슬랙스, 주문 실수해서 웃으면서 다시 주문하시는 모습이 인상적이었어요.",
    tags: ["카페"],
    is_boosted: true,
    match_count: 1,
    time_ago: "5시간 전",
  },
  {
    id: "seed-11",
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    user_id: "seed-u11",
    location_name: "을지로 세운상가 카페",
    date_text: "오늘",
    time_text: "오후 1시경",
    body: "옥상 카페에서 혼자 책 읽고 계셨어요. 바람에 머리카락이 날리는 게 마치 영화 같았어요. 저도 같은 옥상에 앉아있었는데 말을 거는 게 방해가 될 것 같아서...",
    tags: ["카페"],
    is_boosted: true,
    match_count: 0,
    time_ago: "6시간 전",
  },

  // ── 지하철 ──
  {
    id: "seed-8",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    user_id: "seed-u8",
    location_name: "홍대입구역 2호선",
    date_text: "오늘",
    time_text: "오전 8시반",
    body: "출근길 2호선, 같은 칸 문 앞에 서 계셨어요. 베이지 코트에 에어팟 끼고 계셨고, 내릴 때 살짝 미소 지어주신 거... 제가 착각한 건 아니겠죠?",
    tags: ["지하철"],
    is_boosted: false,
    match_count: 3,
    time_ago: "4시간 전",
  },
  {
    id: "seed-2",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    user_id: "seed-u2",
    location_name: "합정역 6번 출구",
    date_text: "어제",
    time_text: "오전 8시반",
    body: "우산을 안 가져왔는데 갑자기 비가 왔어요. 잠깐 처마 밑에서 같이 비를 피했는데 살짝 웃어주신 분. 네이비 코트에 토트백 들고 계셨어요.",
    tags: ["지하철"],
    is_boosted: false,
    match_count: 0,
    time_ago: "어제",
  },
  {
    id: "seed-4",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    user_id: "seed-u4",
    location_name: "강남역 지하상가",
    date_text: "2일 전",
    time_text: "오후 7시경",
    body: "비 오는 날 지하상가에서 같은 방향으로 걷고 있었어요. 출구에서 저한테 먼저 길을 양보해주셨어요. 그 짧은 눈맞춤이 아직도 생각나요.",
    tags: ["지하철"],
    is_boosted: false,
    match_count: 0,
    time_ago: "2일 전",
  },

  // ── 공원 ──
  {
    id: "seed-6",
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    user_id: "seed-u6",
    location_name: "성수 서울숲",
    date_text: "오늘",
    time_text: "오후 5시경",
    body: "서울숲 산책로에서 골든 리트리버 산책시키고 계셨던 분. 저도 비숑 데리고 있었는데 강아지들이 서로 인사하다가 잠깐 얘기 나눴었어요. 더 이야기하고 싶었는데...",
    tags: ["공원"],
    is_boosted: false,
    match_count: 1,
    time_ago: "8시간 전",
  },
  {
    id: "seed-9",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    user_id: "seed-u9",
    location_name: "홍대 연트럴파크",
    date_text: "5일 전",
    time_text: "오후 7시경",
    body: "벤치에서 기타 치고 계셨던 분. 지나가다 멈춰서 한참 듣고 있었는데, 연주 끝나고 눈이 마주쳤을 때 고개 숙여 인사해주셨죠. 그 곡 제목이 뭐였는지 너무 궁금해요.",
    tags: ["공원"],
    is_boosted: false,
    match_count: 0,
    time_ago: "5일 전",
  },

  // ── 서점 ──
  {
    id: "seed-10",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    user_id: "seed-u10",
    location_name: "홍대 교보문고",
    date_text: "어제",
    time_text: "오후 4시경",
    body: "에세이 코너에서 같은 책 집어 들었어요. 서로 눈이 마주쳐서 멋쩍게 웃었는데, 그분이 먼저 양보해주셨어요. 베이지 카디건에 안경, 책 좋아하시는 분 같았어요.",
    tags: ["서점"],
    is_boosted: false,
    match_count: 0,
    time_ago: "어제",
  },

  // ── 헬스장 ──
  {
    id: "seed-5",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    user_id: "seed-u5",
    location_name: "강남 피트니스 센터",
    date_text: "4일 전",
    time_text: "오후 8시경",
    body: "러닝머신 옆자리에서 달리고 계셨어요. 검은 반팔에 이어폰 끼고 진지하게 운동하시는 모습이 멋있었어요. 내릴 때 살짝 고개 숙여 인사해주셨는데 더 말을 걸 걸...",
    tags: ["헬스장"],
    is_boosted: false,
    match_count: 0,
    time_ago: "4일 전",
  },

  // ── 식당 ──
  {
    id: "seed-12",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    user_id: "seed-u12",
    location_name: "을지로 노가리 골목",
    date_text: "2일 전",
    time_text: "오후 9시경",
    body: "친구들이랑 노가리 먹고 있었는데, 옆 테이블에서 혼자 맥주 드시면서 책 읽고 계셨어요. 나중에 눈이 마주쳤을 때 살짝 건배해주신 거 기억나요.",
    tags: ["식당"],
    is_boosted: false,
    match_count: 0,
    time_ago: "2일 전",
  },

  // ── 전시/갤러리 ──
  {
    id: "seed-7",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    user_id: "seed-u7",
    location_name: "성수 대림창고 갤러리",
    date_text: "3일 전",
    time_text: "오후 2시경",
    body: "전시 보다가 같은 작품 앞에서 한참 서 계셨어요. 서로 눈이 마주치고 둘 다 웃었어요. 그때 말을 걸었으면 좋았을 텐데...",
    tags: ["카페"],
    is_boosted: false,
    match_count: 0,
    time_ago: "3일 전",
  },

  // ── 야구장 ──
  {
    id: "seed-13",
    created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
    user_id: "seed-u13",
    location_name: "잠실 야구장 1루석",
    date_text: "오늘",
    time_text: "오후 6시경",
    body: "LG 경기 보러 왔는데 옆자리에 앉으셨던 분. 같이 응원하다가 홈런 나왔을 때 하이파이브 했잖아요. 그 웃음이 아직도 생각나요. 경기 끝나고 말 걸고 싶었는데...",
    tags: ["야구장"],
    is_boosted: false,
    match_count: 2,
    time_ago: "10시간 전",
  },
  {
    id: "seed-14",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    user_id: "seed-u14",
    location_name: "고척 스카이돔",
    date_text: "어제",
    time_text: "오후 7시경",
    body: "키움 경기 3루석에서 혼자 오신 것 같았어요. 치맥 드시면서 진지하게 경기 보시는 모습이 멋있었어요. 8회 때 눈이 마주쳤을 때 살짝 웃어주셨죠.",
    tags: ["야구장"],
    is_boosted: false,
    match_count: 0,
    time_ago: "어제",
  },

  // ── 축제 ──
  {
    id: "seed-15",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    user_id: "seed-u15",
    location_name: "여의도 벚꽃축제",
    date_text: "어제",
    time_text: "오후 4시경",
    body: "벚꽃길 걷다가 사진 찍어달라고 부탁하셨던 분. 찍어드리고 나서 '잘 나왔어요' 하니까 환하게 웃어주셨는데, 그 미소가 벚꽃보다 예뻤어요.",
    tags: ["축제"],
    is_boosted: false,
    match_count: 1,
    time_ago: "어제",
  },
];

// 태그 탭에 맞게 시드 데이터 필터링
export function filterSeedByTag(tag: string): PostWithMeta[] {
  if (!tag || tag === "전체") return seedPosts;
  return seedPosts.filter((p) => p.tags.includes(tag));
}

// 하위호환
export const filterSeedByLocation = filterSeedByTag;
export const mockPosts = seedPosts;

export const mockMatches: MatchWithPost[] = [
  {
    id: "m1",
    created_at: new Date(Date.now() - 1800000).toISOString(),
    post_id: "seed-1",
    requester_id: "seed-u5",
    message:
      "맞아요, 저 그때 어니언에서 작업하고 있었어요. 검은 니트에 안경... 맞는 것 같아요. 저도 눈이 마주쳤던 기억이 나요 😊",
    status: "pending",
    post: seedPosts[0],
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
