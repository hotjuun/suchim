"use client";

import { DAILY_LIMITS } from "@/lib/coins";

interface FeedLimitBannerProps {
  viewCount: number;
  onUnlock: () => void;
  onWatchAd: () => void;
}

export default function FeedLimitBanner({
  viewCount,
  onUnlock,
  onWatchAd,
}: FeedLimitBannerProps) {
  const remaining = DAILY_LIMITS.FEED_VIEWS - viewCount;

  if (remaining > 3) return null;

  if (remaining > 0) {
    return (
      <div className="mx-5 mb-3 rounded-2xl bg-surface p-4 text-center">
        <p className="text-sm text-secondary">
          오늘 무료 열람 <strong className="text-primary">{remaining}건</strong>{" "}
          남았어요
        </p>
      </div>
    );
  }

  return (
    <div className="mx-5 mb-3 rounded-2xl border border-accent/20 bg-accent-light p-5 text-center">
      <span className="mb-2 block text-3xl">📖</span>
      <h3 className="mb-1 text-base font-bold text-primary">
        오늘의 무료 열람을 모두 사용했어요
      </h3>
      <p className="mb-4 text-sm text-secondary">
        더 많은 스침을 확인하고 싶다면
      </p>
      <div className="flex gap-2">
        <button
          onClick={onWatchAd}
          className="flex-1 rounded-xl bg-white py-3 text-sm font-semibold text-primary border border-border transition-all active:bg-surface"
        >
          광고 보고 열기
        </button>
        <button
          onClick={onUnlock}
          className="flex-1 rounded-xl bg-accent py-3 text-sm font-semibold text-white transition-all active:scale-[0.98]"
        >
          9코인으로 열기
        </button>
      </div>
    </div>
  );
}
