"use client";

import { useRouter } from "next/navigation";
import { HeartIcon, PenIcon, SearchIcon } from "@/components/Icons";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm text-center">
        {/* Celebration */}
        <span className="mb-4 block text-6xl">🎉</span>
        <h1 className="mb-2 text-2xl font-bold text-primary">
          환영해요!
        </h1>
        <p className="mb-10 text-sm leading-relaxed text-secondary">
          이제 스쳐간 인연을 찾을 수 있어요.
          <br />
          무엇부터 해볼까요?
        </p>

        {/* Action Cards */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/write")}
            className="flex w-full items-center gap-4 rounded-2xl bg-white border border-border p-5 text-left transition-all active:scale-[0.98]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-light">
              <PenIcon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-primary">
                글 쓰기
              </p>
              <p className="text-xs text-secondary">
                스쳐간 그 순간을 기록해보세요
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push("/")}
            className="flex w-full items-center gap-4 rounded-2xl bg-white border border-border p-5 text-left transition-all active:scale-[0.98]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-light">
              <SearchIcon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-primary">
                둘러보기
              </p>
              <p className="text-xs text-secondary">
                누군가 나를 찾고 있을지도 몰라요
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push("/")}
            className="flex w-full items-center gap-4 rounded-2xl bg-white border border-border p-5 text-left transition-all active:scale-[0.98]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-light">
              <HeartIcon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-primary">
                이런 서비스예요
              </p>
              <p className="text-xs text-secondary">
                스침이 어떻게 작동하는지 알아보기
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
