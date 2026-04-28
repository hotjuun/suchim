import { ImageResponse } from "next/og";

export const alt = "스침 — 스쳐간 순간을 붙잡는 곳";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #FF3B5C 0%, #FF6B81 50%, #FFA5B4 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            letterSpacing: "-2px",
            marginBottom: 16,
          }}
        >
          suchim
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: "rgba(255,255,255,0.95)",
            fontWeight: 500,
            marginBottom: 48,
          }}
        >
          스쳐간 순간을 붙잡는 곳
        </div>

        {/* Example cards */}
        <div
          style={{
            display: "flex",
            gap: 24,
          }}
        >
          {[
            { loc: "합정 카페 어니언", text: "창가 자리에서 맥북으로 작업하고 계셨던 분..." },
            { loc: "강남역 지하상가", text: "같은 방향으로 걷고 있었는데 눈이 마주쳤어요..." },
            { loc: "홍대 2호선", text: "출근길, 내릴 때 살짝 미소 지어주신 거..." },
          ].map((card) => (
            <div
              key={card.loc}
              style={{
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                borderRadius: 20,
                padding: "28px 24px",
                width: 300,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                📍 {card.loc}
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: 1.5,
                }}
              >
                {card.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
