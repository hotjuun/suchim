// 관리자 권한 체크
// 환경변수 NEXT_PUBLIC_ADMIN_EMAILS에 콤마로 구분된 이메일 목록 설정
// 예: admin1@example.com,admin2@example.com

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
