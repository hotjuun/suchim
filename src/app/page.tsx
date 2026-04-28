"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PostCard from "@/components/PostCard";
import { SearchIcon, HeartIcon } from "@/components/Icons";
import { useAuth } from "@/components/AuthProvider";
import { getPosts, getTotalPostCount, searchPosts } from "@/lib/posts";
import { filterSeedByTag, seedPosts, TAG_TABS } from "@/lib/mock-data";
import type { Post, PostWithMeta } from "@/types";

// ── 시드 데이터 유지 전략 ──
// 전체 실제 글 20개 미만: 모든 탭에 시드 유지
// 전체 20개 이상 + 해당 탭 실제 글 5개 미만: 해당 탭만 시드 유지
// 전체 20개 이상 + 해당 탭 5개 이상: 시드 숨김
const GLOBAL_THRESHOLD = 20;
const PER_TAB_THRESHOLD = 5;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "방금 전";
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "어제";
  return `${days}일 전`;
}

function toPostWithMeta(p: PostWithMeta | (Post & { match_count?: number; created_at: string })): PostWithMeta {
  return { ...p, match_count: (p as PostWithMeta).match_count ?? 0, time_ago: timeAgo(p.created_at) } as PostWithMeta;
}

export default function FeedPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState<PostWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const isSearching = query.trim().length > 0;

  // 탭 필터
  useEffect(() => {
    if (isSearching) return;

    async function load() {
      setLoading(true);
      const tag = TAG_TABS[activeTab];

      try {
        // 실제 글 가져오기 + 전체 글 수 동시 조회
        const [data, totalCount] = await Promise.all([
          getPosts(tag),
          getTotalPostCount(),
        ]);

        const dbPosts = data.map(toPostWithMeta);
        const tabCount = data.length;

        // 시드 데이터 포함 여부 판단
        const needSeed =
          totalCount < GLOBAL_THRESHOLD || tabCount < PER_TAB_THRESHOLD;

        if (needSeed) {
          const seed = filterSeedByTag(tag);
          setPosts([...dbPosts, ...seed]);
        } else {
          setPosts(dbPosts);
        }
      } catch {
        // DB 연결 실패 시 시드 데이터만
        setPosts(filterSeedByTag(tag));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activeTab, isSearching]);

  // 검색
  useEffect(() => {
    if (!isSearching) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      const q = query.trim().toLowerCase();

      // 시드 데이터에서 검색
      const seedResults = seedPosts.filter(
        (p) =>
          p.location_name.toLowerCase().includes(q) ||
          p.body.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );

      try {
        const [data, totalCount] = await Promise.all([
          searchPosts(q),
          getTotalPostCount(),
        ]);
        const dbResults = data.map(toPostWithMeta);

        // 검색에서도 동일한 전략: 전체 글 충분하면 시드 제외
        if (totalCount >= GLOBAL_THRESHOLD && dbResults.length >= PER_TAB_THRESHOLD) {
          setPosts(dbResults);
        } else {
          setPosts([...dbResults, ...seedResults]);
        }
      } catch {
        setPosts(seedResults);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, isSearching]);

  return (
    <div className="flex min-h-full flex-col bg-bg">
      <Header />

      {/* Search Bar */}
      <div className="relative mx-6 mt-3 mb-2">
        <SearchIcon className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-secondary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="장소, 키워드로 검색"
          className="w-full rounded-xl bg-surface py-3 pl-11 pr-4 text-sm text-primary outline-none placeholder:text-secondary focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Tag Filter Chips */}
      {!isSearching && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-6 py-2">
          {TAG_TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`shrink-0 whitespace-nowrap rounded-3xl border px-4 py-2 text-[13px] font-medium transition-all ${
                activeTab === i
                  ? "border-primary bg-primary text-white"
                  : "border-border-strong bg-transparent text-secondary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* 검색 중 안내 */}
      {isSearching && !loading && (
        <div className="px-6 py-2">
          <p className="text-xs text-secondary">
            &ldquo;{query.trim()}&rdquo; 검색 결과 {posts.length}건
          </p>
        </div>
      )}

      {/* Hero CTA */}
      {!authLoading && !user && !isSearching && (
        <div className="mx-5 mt-2 mb-1 overflow-hidden rounded-2xl bg-gradient-to-r from-accent to-[#FF6B81] p-5 text-white shadow-[0_4px_20px_rgba(255,59,92,0.25)]">
          <p className="mb-1 text-[15px] font-bold leading-snug">
            스쳐간 그 사람, 나를 찾고 있을지도?
          </p>
          <p className="mb-4 text-[13px] leading-relaxed opacity-90">
            매일 수십 건의 스침이 올라오고 있어요.
            <br />
            로그인하고 나의 인연을 찾아보세요.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-accent shadow-sm transition-all active:scale-[0.97]"
            >
              <HeartIcon className="h-4 w-4" />
              시작하기
            </button>
            <button
              onClick={() => router.push("/login")}
              className="rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.97]"
            >
              로그인
            </button>
          </div>
        </div>
      )}

      {/* Feed */}
      <main className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-5 pb-28 pt-2">
        {loading ? (
          <div className="flex justify-center pt-20">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-surface border-t-accent" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center pt-20 text-center">
            <span className="mb-3 text-4xl">🍃</span>
            <p className="text-sm text-secondary">
              {isSearching
                ? `"${query.trim()}"에 대한 스침이 없어요`
                : "아직 이 카테고리에 스침이 없어요"}
            </p>
            {!isSearching && (
              <button
                onClick={() => router.push(user ? "/write" : "/login")}
                className="mt-4 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white"
              >
                첫 번째 글 쓰기
              </button>
            )}
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </main>

      <BottomNav />
    </div>
  );
}
