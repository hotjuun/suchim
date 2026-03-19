"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Toast from "@/components/Toast";
import { ChevronLeftIcon, MapPinIcon, ShieldIcon } from "@/components/Icons";
import { useAuth } from "@/components/AuthProvider";
import { createPost } from "@/lib/posts";
import { TAG_OPTIONS } from "@/lib/mock-data";

export default function WritePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [body, setBody] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const canSubmit = location.trim() && body.trim().length >= 10 && !submitting;

  const progressSteps = [
    location.trim().length > 0,
    date.trim().length > 0,
    body.trim().length >= 10,
    selectedTags.length > 0,
  ];
  const filledCount = progressSteps.filter(Boolean).length;

  const handleSubmit = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      await createPost({
        user_id: user.id,
        location_name: location.trim(),
        date_text: date.trim() || "오늘",
        time_text: time.trim() || "",
        body: body.trim(),
        tags: selectedTags,
      });
      setToast({ show: true, message: "스침이 등록되었어요!", type: "success" });
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      setToast({ show: true, message: err instanceof Error ? err.message : "글 등록에 실패했습니다", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-bg">
      <Toast message={toast.message} show={toast.show} type={toast.type} onClose={() => setToast(t => ({ ...t, show: false }))} />
      {/* Header */}
      <div className="flex items-center justify-between px-6 pb-2 pt-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-0.5 text-sm font-medium text-primary"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          취소
        </button>
        <span className="text-base font-semibold text-primary">새 글</span>
        <button
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="rounded-3xl bg-accent px-5 py-2 text-sm font-semibold text-white transition-all disabled:bg-secondary/30 disabled:text-secondary"
        >
          {submitting ? "올리는 중..." : "올리기"}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-1 px-6 pb-5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-[3px] flex-1 rounded-full transition-colors ${
              i < filledCount ? "bg-accent" : "bg-surface"
            }`}
          />
        ))}
      </div>

      {/* Form */}
      <div className="no-scrollbar flex-1 space-y-7 overflow-y-auto px-6 pb-28">
        {/* Where */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-primary">
            어디서
          </label>
          <p className="mb-3 text-xs text-secondary">
            만남이 있었던 장소를 알려주세요
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="장소 검색 (카페명, 역 이름 등)"
              className="flex-1 rounded-xl border-[1.5px] border-border-strong bg-white px-4 py-3.5 text-[15px] text-primary outline-none placeholder:text-[#C7C7CC] focus:border-accent focus:ring-2 focus:ring-accent-light"
            />
            <button className="flex items-center justify-center gap-1 rounded-xl border-[1.5px] border-border-strong bg-white px-4 text-sm font-semibold text-accent transition-colors active:bg-surface">
              <MapPinIcon className="h-4 w-4" />
              지도
            </button>
          </div>
        </div>

        {/* When */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-primary">
            언제
          </label>
          <p className="mb-3 text-xs text-secondary">
            대략적인 날짜와 시간이면 충분해요
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="날짜 (예: 오늘, 어제)"
              className="flex-1 rounded-xl border-[1.5px] border-border-strong bg-white px-4 py-3.5 text-[15px] text-primary outline-none placeholder:text-[#C7C7CC] focus:border-accent focus:ring-2 focus:ring-accent-light"
            />
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="시간 (예: 오후 3시경)"
              className="flex-1 rounded-xl border-[1.5px] border-border-strong bg-white px-4 py-3.5 text-[15px] text-primary outline-none placeholder:text-[#C7C7CC] focus:border-accent focus:ring-2 focus:ring-accent-light"
            />
          </div>
        </div>

        {/* Story */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-primary">
            그 순간
          </label>
          <p className="mb-3 text-xs text-secondary">
            상대방이 &apos;나다!&apos;라고 알아볼 수 있게 적어주세요
          </p>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, 500))}
            placeholder="어떤 모습이었는지, 어떤 순간이 기억에 남는지..."
            rows={5}
            className="w-full resize-none rounded-xl border-[1.5px] border-border-strong bg-white px-4 py-4 text-[15px] leading-[1.7] text-primary outline-none placeholder:text-[#C7C7CC] focus:border-accent focus:ring-2 focus:ring-accent-light"
          />
          <p className="mt-1.5 text-right text-xs text-secondary">
            {body.length} / 500
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-primary">
            태그
          </label>
          <p className="mb-3 text-xs text-secondary">
            해당하는 상황을 골라주세요
          </p>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`rounded-3xl border-[1.5px] px-4 py-2 text-[13px] font-medium transition-all ${
                  selectedTags.includes(tag)
                    ? "border-accent bg-accent-light text-accent"
                    : "border-border-strong bg-transparent text-secondary"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Safety Notice */}
        <div className="flex gap-2.5 rounded-xl bg-surface p-4">
          <ShieldIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-secondary" />
          <p className="text-xs leading-relaxed text-secondary">
            실명, 전화번호, SNS 아이디 등 개인정보는 포함할 수 없습니다. 상황과
            분위기를 중심으로 작성해 주세요.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
