import { supabase } from "./supabase";

// 코인 가격표
export const COIN_PRICES = {
  BOOST: 19, // 1,900원 = 19코인
  HINT: 5, // 500원 = 5코인 (1회)
  CHAT_TICKET: 29, // 2,900원 = 29코인
  CONTACT_EXCHANGE: 39, // 3,900원 = 39코인
  EXTRA_LIKE: 5, // 500원 = 5코인 ("저예요" 추가)
  DAILY_PASS: 9, // 900원 = 9코인 (일일 읽기 패스)
} as const;

// 코인 패키지
export const COIN_PACKAGES = [
  { coins: 50, price: 4900, label: "50코인", bonus: "" },
  { coins: 100, price: 8900, label: "100코인", bonus: "10% 할인" },
  { coins: 200, price: 15900, label: "200코인", bonus: "20% 할인" },
] as const;

// 일일 무료 제한
export const DAILY_LIMITS = {
  FEED_VIEWS: 10, // 피드 하루 10건 무료
  LIKE_REQUESTS: 3, // "저예요" 하루 3회 무료
  CHAT_MESSAGES: 20, // 채팅 메시지 20건 제한
} as const;

// 사용자 코인 잔액 조회
export async function getCoinBalance(userId: string): Promise<number> {
  const { data } = await supabase
    .from("user_coins")
    .select("balance")
    .eq("user_id", userId)
    .single();
  return data?.balance ?? 0;
}

// 코인 차감
export async function spendCoins(
  userId: string,
  amount: number,
  reason: string
): Promise<boolean> {
  const balance = await getCoinBalance(userId);
  if (balance < amount) return false;

  const { error } = await supabase.rpc("spend_coins", {
    p_user_id: userId,
    p_amount: amount,
    p_reason: reason,
  });

  return !error;
}

// 코인 충전
export async function addCoins(
  userId: string,
  amount: number,
  reason: string
): Promise<boolean> {
  const { error } = await supabase.rpc("add_coins", {
    p_user_id: userId,
    p_amount: amount,
    p_reason: reason,
  });

  return !error;
}

// 일일 사용량 조회
export async function getDailyUsage(
  userId: string,
  actionType: string
): Promise<number> {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("daily_usage")
    .select("count")
    .eq("user_id", userId)
    .eq("action_type", actionType)
    .eq("date", today)
    .single();
  return data?.count ?? 0;
}

// 일일 사용량 증가
export async function incrementDailyUsage(
  userId: string,
  actionType: string
): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  await supabase.rpc("increment_daily_usage", {
    p_user_id: userId,
    p_action_type: actionType,
    p_date: today,
  });
}

// 연락처 패턴 감지
const CONTACT_PATTERNS = [
  /01[0-9]-?\d{3,4}-?\d{4}/, // 전화번호
  /\d{3}-\d{3,4}-\d{4}/, // 전화번호 변형
  /@[a-zA-Z0-9_.]+/, // 인스타 @아이디
  /kakao|카톡|카카오|ktalk/i, // 카카오톡
  /insta|인스타/i, // 인스타그램
  /https?:\/\//i, // URL
  /line\s*:?\s*[a-zA-Z0-9]/i, // 라인
  /telegram|텔레그램/i, // 텔레그램
];

export function containsContactInfo(message: string): boolean {
  return CONTACT_PATTERNS.some((pattern) => pattern.test(message));
}
