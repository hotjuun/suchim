"use client";

import { BellIcon, UserIcon } from "./Icons";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 pb-1 pt-3">
      <h1
        className="text-[28px] font-bold tracking-[-1.5px] text-primary"
        style={{ fontFamily: "var(--font-logo)" }}
      >
        suchim
      </h1>
      <div className="flex gap-3">
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-surface transition-colors active:bg-border-strong">
          <BellIcon className="h-[18px] w-[18px] text-primary" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-surface transition-colors active:bg-border-strong">
          <UserIcon className="h-[18px] w-[18px] text-primary" />
        </button>
      </div>
    </header>
  );
}
