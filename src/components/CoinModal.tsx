"use client";

import { useState } from "react";
import { COIN_PACKAGES } from "@/lib/coins";

interface CoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onPurchase: (coins: number) => void;
}

export default function CoinModal({
  isOpen,
  onClose,
  balance,
  onPurchase,
}: CoinModalProps) {
  const [selected, setSelected] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-[500px] rounded-t-3xl bg-white px-6 pb-10 pt-6 animate-in slide-in-from-bottom">
        {/* Handle */}
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-border-strong" />

        {/* Balance */}
        <div className="mb-6 text-center">
          <p className="text-sm text-secondary">보유 코인</p>
          <p className="mt-1 text-3xl font-bold text-primary">
            {balance}
            <span className="ml-1 text-base font-medium text-secondary">
              코인
            </span>
          </p>
        </div>

        {/* Packages */}
        <div className="mb-6 space-y-2">
          {COIN_PACKAGES.map((pkg, i) => (
            <button
              key={pkg.coins}
              onClick={() => setSelected(i)}
              className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 transition-all ${
                selected === i
                  ? "border-accent bg-accent-light"
                  : "border-border bg-white"
              }`}
            >
              <div className="text-left">
                <p className="text-base font-bold text-primary">{pkg.label}</p>
                {pkg.bonus && (
                  <p className="text-xs font-medium text-accent">{pkg.bonus}</p>
                )}
              </div>
              <p className="text-lg font-bold text-primary">
                {pkg.price.toLocaleString()}원
              </p>
            </button>
          ))}
        </div>

        {/* Actions */}
        <button
          onClick={() => {
            onPurchase(COIN_PACKAGES[selected].coins);
            onClose();
          }}
          className="mb-3 w-full rounded-2xl bg-accent py-4 text-base font-bold text-white transition-all active:scale-[0.98]"
        >
          {COIN_PACKAGES[selected].price.toLocaleString()}원 결제하기
        </button>
        <button
          onClick={onClose}
          className="w-full py-3 text-sm font-medium text-secondary"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
