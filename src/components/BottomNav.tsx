"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  SearchIcon,
  PenIcon,
  HeartIcon,
  UserIcon,
} from "./Icons";

const tabs = [
  { href: "/", icon: HomeIcon, label: "피드" },
  { href: "/explore", icon: SearchIcon, label: "탐색" },
  { href: "/write", icon: PenIcon, label: "글쓰기", isCenter: true },
  { href: "/matches", icon: HeartIcon, label: "매칭" },
  { href: "/mypage", icon: UserIcon, label: "MY" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-around border-t border-border bg-white/92 px-2 pb-7 pt-2.5 backdrop-blur-xl">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;

        if (tab.isCenter) {
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-0.5"
            >
              <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent shadow-[0_4px_16px_rgba(255,59,92,0.35)] transition-transform active:scale-95">
                <tab.icon className="h-[22px] w-[22px] text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-semibold text-accent">
                {tab.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="relative flex flex-col items-center gap-1"
          >
            {isActive && (
              <span className="absolute -top-2.5 h-[3px] w-5 rounded-full bg-accent" />
            )}
            <tab.icon
              className={`h-6 w-6 transition-colors ${isActive ? "text-accent" : "text-secondary"}`}
            />
            <span
              className={`text-[10px] ${isActive ? "font-semibold text-accent" : "font-medium text-secondary"}`}
            >
              {tab.label}
            </span>
            {tab.badge && tab.badge > 0 && (
              <span className="absolute -right-1.5 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-accent px-1 text-[9px] font-bold text-white">
                {tab.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
