"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        // 가입 즉시 로그인 → 온보딩으로 이동
        router.push("/welcome");
      } else {
        await signIn(email, password);
        router.push("/");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "오류가 발생했습니다";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 text-center">
          <h1
            className="mb-2 text-4xl font-bold tracking-[-2px] text-primary"
            style={{ fontFamily: "var(--font-logo)" }}
          >
            suchim
          </h1>
          <p className="text-sm text-secondary">
            스쳐간 순간을 붙잡는 곳
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            required
            className="w-full rounded-xl border-[1.5px] border-border-strong bg-white px-4 py-3.5 text-[15px] text-primary outline-none placeholder:text-[#C7C7CC] focus:border-accent focus:ring-2 focus:ring-accent-light"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 (6자 이상)"
            required
            minLength={6}
            className="w-full rounded-xl border-[1.5px] border-border-strong bg-white px-4 py-3.5 text-[15px] text-primary outline-none placeholder:text-[#C7C7CC] focus:border-accent focus:ring-2 focus:ring-accent-light"
          />

          {error && (
            <p className="rounded-lg bg-accent-light px-3 py-2 text-xs text-accent">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-white transition-all disabled:opacity-50"
          >
            {loading
              ? "잠시만요..."
              : isSignUp
                ? "가입하기"
                : "로그인"}
          </button>
        </form>

        {/* Toggle */}
        <p className="mt-6 text-center text-sm text-secondary">
          {isSignUp ? "이미 계정이 있나요?" : "처음이신가요?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="font-semibold text-primary underline"
          >
            {isSignUp ? "로그인" : "가입하기"}
          </button>
        </p>
      </div>
    </div>
  );
}
