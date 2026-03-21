"use client";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  emoji: string;
  coinCost: number;
  balance: number;
  onPay: () => void;
  onBuyCoins: () => void;
}

export default function PaywallModal({
  isOpen,
  onClose,
  title,
  description,
  emoji,
  coinCost,
  balance,
  onPay,
  onBuyCoins,
}: PaywallModalProps) {
  if (!isOpen) return null;

  const canAfford = balance >= coinCost;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center">
        <span className="mb-4 block text-5xl">{emoji}</span>
        <h3 className="mb-2 text-lg font-bold text-primary">{title}</h3>
        <p className="mb-6 text-sm leading-relaxed text-secondary">
          {description}
        </p>

        {/* Cost */}
        <div className="mb-6 rounded-2xl bg-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary">필요 코인</span>
            <span className="text-lg font-bold text-primary">
              {coinCost}코인
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-secondary">보유 코인</span>
            <span
              className={`text-lg font-bold ${canAfford ? "text-primary" : "text-accent"}`}
            >
              {balance}코인
            </span>
          </div>
        </div>

        {canAfford ? (
          <button
            onClick={onPay}
            className="mb-3 w-full rounded-2xl bg-accent py-3.5 text-base font-bold text-white transition-all active:scale-[0.98]"
          >
            {coinCost}코인으로 이용하기
          </button>
        ) : (
          <button
            onClick={onBuyCoins}
            className="mb-3 w-full rounded-2xl bg-accent py-3.5 text-base font-bold text-white transition-all active:scale-[0.98]"
          >
            코인 충전하기
          </button>
        )}
        <button
          onClick={onClose}
          className="w-full py-2 text-sm font-medium text-secondary"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
