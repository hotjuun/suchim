"use client";

import { useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { HeartIcon } from "@/components/Icons";
import { mockMatches, mockChats } from "@/lib/mock-data";

const TABS = ["새로운", "대화 중", "지난 스침"];

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex min-h-full flex-col bg-bg">
      <Header />

      {/* Tabs */}
      <div className="flex border-b border-border px-6">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`relative px-5 py-3 text-sm font-medium transition-colors ${
              activeTab === i
                ? "font-semibold text-primary"
                : "text-secondary"
            }`}
          >
            {tab}
            {i === 0 && mockMatches.length > 0 && (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-white">
                {mockMatches.length}
              </span>
            )}
            {i === 1 && mockChats.length > 0 && (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-success px-1.5 text-[11px] font-bold text-white">
                {mockChats.length}
              </span>
            )}
            {activeTab === i && (
              <span className="absolute bottom-[-1px] left-5 right-5 h-0.5 rounded-sm bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-5 pb-28 pt-4">
        {activeTab === 0 && (
          <>
            {/* Pending matches */}
            {mockMatches.map((match) => (
              <div
                key={match.id}
                className="overflow-hidden rounded-[20px] border border-border bg-white"
              >
                {/* Post preview */}
                <div className="p-[18px] pb-3.5">
                  <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-md bg-accent-light px-2.5 py-1 text-[11px] font-semibold text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    NEW
                  </div>
                  <p className="mb-2 border-l-[3px] border-surface pl-3 text-sm leading-relaxed text-primary">
                    &ldquo;{match.post.body.slice(0, 60)}...&rdquo;
                  </p>
                  <p className="text-xs text-secondary">
                    내가 쓴 글 · {match.post.time_ago}
                  </p>
                </div>

                {/* Responder */}
                <div className="flex items-center gap-3 border-t border-border bg-surface px-[18px] py-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white text-xl">
                    {match.requester_emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-semibold text-primary">
                      {match.requester_label}
                    </h4>
                    <p className="truncate text-xs text-secondary">
                      &ldquo;{match.message.slice(0, 40)}...&rdquo;
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-secondary">30분 전</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 p-[18px] pt-3.5">
                  <button className="flex-1 rounded-xl bg-surface py-3 text-sm font-semibold text-secondary transition-colors active:bg-border-strong">
                    아닌 것 같아요
                  </button>
                  <button className="flex-1 rounded-xl bg-accent py-3 text-sm font-semibold text-white transition-colors active:bg-accent-hover">
                    맞아요!
                  </button>
                </div>
              </div>
            ))}

            {/* Active chats */}
            {mockChats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center gap-3.5 rounded-[20px] border border-border bg-white p-4 transition-all active:bg-surface"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface text-2xl">
                  {chat.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-primary">
                    {chat.label}
                  </h4>
                  <p className="truncate text-[13px] text-secondary">
                    {chat.lastMessage}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="text-[11px] text-secondary">{chat.time}</span>
                  {chat.unread > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-white">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Empty state */}
        {(activeTab === 1 || activeTab === 2) && (
          <div className="flex flex-col items-center pt-20 text-center">
            <span className="mb-4 text-5xl">✨</span>
            <h3 className="mb-2 text-base font-semibold text-primary">
              {activeTab === 1
                ? "아직 대화 중인 스침이 없어요"
                : "지난 스침이 없어요"}
            </h3>
            <p className="text-sm leading-relaxed text-secondary">
              글을 올리면 그 사람도
              <br />
              당신을 찾을 수 있어요
            </p>
            <button className="mt-5 rounded-3xl bg-primary px-7 py-3 text-sm font-semibold text-white transition-all active:scale-95">
              글 쓰러 가기
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
