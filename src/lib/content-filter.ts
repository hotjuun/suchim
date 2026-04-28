// 콘텐츠 필터링 — 욕설, 성적 표현, 혐오, 폭력 등 유해 콘텐츠 차단

// 우회 방지를 위한 정규화: 공백, 특수문자, 자음/모음 분리 처리
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s\.\,\!\?\-\_\*\~\^\[\]\(\)\{\}\<\>\/\\|"'`]/g, "")
    .replace(/[0-9]/g, "");
}

// 금지어 목록 (간단한 substring 매칭으로 더 넓게 잡음)
const PROFANITY_WORDS = [
  // 시발 계열
  "시발", "씨발", "씨바", "씨빨", "씨방", "ㅅㅂ", "ㅆㅂ", "시방", "씨댕", "쉬발", "쒸발",
  "시1발", "시벌", "씨벌", "시바", "시팔", "씨팔", "시파", "씨파",
  // 새끼 계열
  "새끼", "새기", "색기", "색끼", "쉑기", "샊", "쌔끼", "쉐키", "쌔키",
  "개새", "개색", "개세", "개쉐", "개쒜", "개쌔",
  // 병신 계열
  "병신", "빙신", "븅신", "ㅂㅅ", "병1신", "변신",
  // 좆 계열
  "좆", "좃", "존나", "졸라", "조낸", "ㅈㄴ", "졸려", "졸ㄹㅏ",
  // 닥쳐/꺼져
  "닥쳐", "닥치", "꺼져", "꺼지", "꺼저",
  // 지랄/염병/미친
  "지랄", "ㅈㄹ", "염병", "엠병", "미친", "ㅁㅊ", "또라이", "또라ㅇ", "돌았",
  // 등신/머저리
  "등신", "머저리", "멍청이", "느금마", "느금", "엄빠없",
  // 성적
  "보지", "자지", "자ㅈ", "ㅂㅈ", "ㅈㅈ", "야동", "야짤", "포르노",
  "섹스", "sex", "강간", "강x", "변태", "음란", "몰카",
  // 혐오
  "한남충", "한녀", "김치녀", "맘충", "틀딱", "흑형", "쪽바리", "짱깨",
  "장애새", "정신병자", "병신새",
  // 폭력
  "죽여", "죽일", "죽엇", "죽으", "패버", "찔러", "칼빵", "테러",
  "쳐맞", "처맞", "쥑여", "쥐겨",
];

// 연락처 패턴
const CONTACT_PATTERNS = [
  /01[016789]-?\d{3,4}-?\d{4}/, // 전화번호
  /카\s*톡/, /카카오\s*톡/, /카\s*카\s*오/, /kakao/i,
  /인스타/, /instagram/i, /insta/i,
  /https?:\/\/\S+/, // URL
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // 이메일
  /텔레\s*그램/, /telegram/i,
  /라인\s*아이디/, /line\s*id/i,
  /디스코드/, /discord/i,
];

export type FilterResult = {
  passed: boolean;
  reason?: string;
};

export function checkContent(text: string): FilterResult {
  const normalized = normalize(text);

  // 욕설/혐오 검사 (정규화된 텍스트에서 substring 매칭)
  for (const word of PROFANITY_WORDS) {
    const normWord = normalize(word);
    if (normWord && normalized.includes(normWord)) {
      return {
        passed: false,
        reason: "욕설, 비하, 혐오, 폭력 표현이 포함되어 있어요. 상황과 분위기를 중심으로 다시 작성해주세요.",
      };
    }
  }

  // 연락처 검사
  for (const pattern of CONTACT_PATTERNS) {
    if (pattern.test(text)) {
      return {
        passed: false,
        reason: "개인정보(전화번호, SNS, 메신저 등)는 포함할 수 없어요. 매칭 후 안전하게 교환해주세요.",
      };
    }
  }

  return { passed: true };
}
