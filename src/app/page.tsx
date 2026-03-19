"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PostCard from "@/components/PostCard";
import { SearchIcon, MapPinIcon } from "@/components/Icons";
import { useAuth } from "@/components/AuthProvider";
import { getPosts } from "@/lib/posts";
import { mockPosts, LOCATION_TABS } from "@/lib/mock-data";
import type { PostWithMeta } from "@/types";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "방금 전";
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "어제";
  return `${days}일 전`;
}

export default function FeedPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState<PostWithMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const location = LOCATION_TABS[activeTab];
        const data = await getPosts(location);

        if (data.length === 0) {
          // DB에 글이 없으면 목업 데이터 표시
          setPosts(mockPosts);
        } else {
          setPosts(
            data.map((p) => ({
              ...p,
              match_count: 0,
              time_ago: timeAgo(p.created_at),
            }))
          );
        }
      } catch {
        // Supabase 연결 실패 시 목업 데이터
        setPosts(mockPosts);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activeTab]);

  return (
    <div className="flex min-h-full flex-col bg-bg">
      <Header />

      {/* Search Bar */}
      <div className="relative mx-6 mt-3 mb-2">
        <SearchIcon className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-secondary" />
        <input
          type="text"
          placeholder="장소, 키워드로 검색"
          className="w-full rounded-xl bg-surface py-3 pl-11 pr-4 text-sm text-primary outline-none placeholder:text-secondary focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Filter Chips */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-6 py-2">
        {LOCATION_TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded-3xl border px-4 py-2 text-[13px] font-medium transition-all ${
              activeTab === i
                ? "border-primary bg-primary text-white"
                : "border-border-strong bg-transparent text-secondary"
            }`}
          >
            {i === 0 && <MapPinIcon className="h-3.5 w-3.5" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Login Banner */}
      {!authLoading && !user && (
        <div className="mx-5 mt-2 flex items-center justify-between rounded-xl bg-surface p-4">
          <p className="text-sm text-secondary">
            로그인하면 글을 쓰고 인연을 찾을 수 있어요
          </p>
          <button
            onClick={() => router.push("/login")}
            className="shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white"
          >
            로그인
          </button>
        </div>
      )}

      {/* Feed */}
      <main className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-5 pb-28 pt-2">
        {loading ? (
          <div className="flex justify-center pt-20">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-surface border-t-accent" />
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </main>

      <BottomNav />
    </div>
  );
}
