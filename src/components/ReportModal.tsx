"use client";

import { useState } from "react";
import { REPORT_REASONS, createReport } from "@/lib/reports";

interface Props {
  postId: string;
  userId: string;
  onClose: () => void;
}

export default function ReportModal({ postId, userId, onClose }: Props) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!reason) return;
    setSubmitting(true);
    try {
      await createReport({
        reporter_id: userId,
        post_id: postId,
        reason,
        details: details.trim() || undefined,
      });
      setSubmitted(true);
    } catch {
      alert("신고 접수에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center">
          <span className="mb-3 block text-5xl">✅</span>
          <h2 className="mb-2 text-lg font-bold text-primary">
            신고가 접수되었어요
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-secondary">
            관리자가 검토 후 적절한 조치를 취할게요.
            <br />
            안전한 커뮤니티를 만들어주셔서 감사해요.
          </p>
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-white"
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6">
        <h2 className="mb-1 text-lg font-bold text-primary">신고하기</h2>
        <p className="mb-4 text-xs text-secondary">
          이 글의 어떤 점이 문제인가요?
        </p>

        <div className="mb-4 space-y-1.5">
          {REPORT_REASONS.map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                reason === r
                  ? "border-accent bg-accent-light text-accent"
                  : "border-border bg-white text-primary"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {reason && (
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value.slice(0, 300))}
            placeholder="자세한 내용 (선택사항)"
            rows={3}
            className="mb-4 w-full resize-none rounded-xl border-[1.5px] border-border-strong bg-white px-4 py-3 text-sm text-primary outline-none placeholder:text-[#C7C7CC] focus:border-accent focus:ring-2 focus:ring-accent-light"
          />
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-surface py-3.5 text-sm font-semibold text-secondary"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason || submitting}
            className="flex-1 rounded-xl bg-accent py-3.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? "보내는 중..." : "신고하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
