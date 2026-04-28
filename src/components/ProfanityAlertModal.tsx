"use client";

interface Props {
  reason: string;
  onClose: () => void;
}

export default function ProfanityAlertModal({ reason, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center">
        <span className="mb-3 block text-5xl">⚠️</span>
        <h2 className="mb-2 text-lg font-bold text-primary">
          작성할 수 없는 표현이에요
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-secondary">
          {reason}
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
