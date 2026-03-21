"use client";

interface HintCardProps {
  matchMessage: string;
  activityArea: string;
  hintLevel: number; // 0=미구매, 1=첫문장, 2=지역, 3=전문
  onBuyHint: (level: number) => void;
  emoji: string;
  label: string;
}

export default function HintCard({
  matchMessage,
  activityArea,
  hintLevel,
  onBuyHint,
  emoji,
  label,
}: HintCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-xl">
          {emoji}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-primary">{label}</h4>
          <p className="text-xs text-secondary">
            힌트 {hintLevel}/3 공개
          </p>
        </div>
      </div>

      {/* Hints */}
      <div className="space-y-2 px-4 pb-4">
        {/* 힌트 1: 첫 문장 */}
        <div className="rounded-xl bg-surface p-3">
          <p className="mb-1 text-[11px] font-medium text-secondary">
            힌트 1 · 첫 문장
          </p>
          {hintLevel >= 1 ? (
            <p className="text-sm text-primary">
              {matchMessage.split(".")[0]}.
            </p>
          ) : (
            <button
              onClick={() => onBuyHint(1)}
              className="flex items-center gap-1.5 text-sm font-semibold text-accent"
            >
              <span className="blur-[6px] select-none text-primary">
                {matchMessage.slice(0, 20)}...
              </span>
              <span className="shrink-0 rounded-full bg-accent-light px-2 py-0.5 text-xs">
                5코인
              </span>
            </button>
          )}
        </div>

        {/* 힌트 2: 활동 지역 */}
        <div className="rounded-xl bg-surface p-3">
          <p className="mb-1 text-[11px] font-medium text-secondary">
            힌트 2 · 활동 지역
          </p>
          {hintLevel >= 2 ? (
            <p className="text-sm text-primary">{activityArea}</p>
          ) : (
            <button
              onClick={() => onBuyHint(2)}
              className={`flex items-center gap-1.5 text-sm font-semibold ${hintLevel >= 1 ? "text-accent" : "text-secondary"}`}
            >
              <span className="blur-[6px] select-none text-primary">
                ○○ 근처
              </span>
              {hintLevel >= 1 && (
                <span className="shrink-0 rounded-full bg-accent-light px-2 py-0.5 text-xs text-accent">
                  5코인
                </span>
              )}
              {hintLevel < 1 && (
                <span className="text-xs text-secondary">힌트 1 구매 후</span>
              )}
            </button>
          )}
        </div>

        {/* 힌트 3: 전문 */}
        <div className="rounded-xl bg-surface p-3">
          <p className="mb-1 text-[11px] font-medium text-secondary">
            힌트 3 · 전체 메시지
          </p>
          {hintLevel >= 3 ? (
            <p className="text-sm leading-relaxed text-primary">
              {matchMessage}
            </p>
          ) : (
            <button
              onClick={() => onBuyHint(3)}
              className={`flex items-center gap-1.5 text-sm font-semibold ${hintLevel >= 2 ? "text-accent" : "text-secondary"}`}
            >
              <span className="blur-[6px] select-none text-primary">
                {matchMessage.slice(0, 30)}...
              </span>
              {hintLevel >= 2 && (
                <span className="shrink-0 rounded-full bg-accent-light px-2 py-0.5 text-xs text-accent">
                  5코인
                </span>
              )}
              {hintLevel < 2 && (
                <span className="text-xs text-secondary">힌트 2 구매 후</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
