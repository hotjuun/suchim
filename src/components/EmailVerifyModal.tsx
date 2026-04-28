"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  email: string;
  onClose: () => void;
  onVerified: () => void;
}

export default function EmailVerifyModal({ email, onClose, onVerified }: Props) {
  const [sent, setSent] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const sendVerification = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (error) throw error;
      setSent(true);
    } catch {
      setError("인증 메일 발송에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  const checkVerification = async () => {
    setChecking(true);
    setError("");
    try {
      // 최신 유저 정보를 서버에서 가져옴
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (user?.email_confirmed_at) {
        onVerified();
      } else {
        setError("아직 인증이 완료되지 않았어요. 이메일을 확인해주세요.");
      }
    } catch {
      setError("확인 중 오류가 발생했어요.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center">
        <span className="mb-3 block text-5xl">📧</span>
        <h2 className="mb-2 text-lg font-bold text-primary">
          이메일 인증이 필요해요
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-secondary">
          글을 쓰려면 이메일 인증을 완료해주세요.
          <br />
          인증 후 안전하게 글을 작성할 수 있어요.
        </p>

        {error && (
          <p className="mb-4 rounded-lg bg-accent-light px-3 py-2 text-xs text-accent">
            {error}
          </p>
        )}

        {!sent ? (
          <button
            onClick={sendVerification}
            className="w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-white"
          >
            {email}로 인증 메일 보내기
          </button>
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl bg-surface p-4">
              <p className="text-sm text-primary font-medium mb-1">메일을 보냈어요!</p>
              <p className="text-xs text-secondary">
                <strong>{email}</strong> 메일함을 확인하고
                <br />인증 링크를 클릭해주세요.
              </p>
            </div>
            <button
              onClick={checkVerification}
              disabled={checking}
              className="w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {checking ? "확인 중..." : "인증 완료했어요"}
            </button>
            <button
              onClick={sendVerification}
              className="w-full text-sm text-secondary underline"
            >
              인증 메일 다시 보내기
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 text-sm text-secondary"
        >
          나중에 할게요
        </button>
      </div>
    </div>
  );
}
