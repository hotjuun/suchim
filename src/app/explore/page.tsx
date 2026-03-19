"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { SearchIcon, MapPinIcon } from "@/components/Icons";
import { supabase } from "@/lib/supabase";
import type { Post } from "@/types";

const POPULAR_LOCATIONS = [
  { name: "합정", emoji: "☕", count: 12 },
  { name: "강남", emoji: "🏙️", count: 8 },
  { name: "홍대", emoji: "🎸", count: 15 },
  { name: "성수", emoji: "🌳", count: 6 },
  { name: "을지로", emoji: "🏮", count: 4 },
  { name: "이태원", emoji: "🌍", count: 3 },
  { name: "연남동", emoji: "🚶", count: 7 },
  { name: "망원동", emoji: "📖", count: 5 },
];

export default function ExplorePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await supabase
          .from("posts")
          .select("*")
          .or(
            `location_name.ilike.%${query}%,body.ilike.%${query}%`
          )
          .order("created_at", { ascending: false })
          .limit(10);
        setResults(data || []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="flex min-h-full flex-col bg-bg">
      <Header />

      {/* Search */}
      <div className="relative mx-6 mt-3 mb-4">
        <SearchIcon className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-secondary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="장소, 키워드로 검색"
          autoFocus
          className="w-full rounded-xl bg-surface py-3 pl-11 pr-4 text-sm text-primary outline-none placeholder:text-secondary focus:ring-2 focus:ring-accent"
        />
      </div>

      <main className="no-scrollbar flex-1 overflow-y-auto px-6 pb-28">
        {query.trim() ? (
          /* Search Results */
          <>
            {searching ? (
              <div className="flex justify-center pt-12">
                <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-surface border-t-accent" />
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                <p className="mb-3 text-xs text-secondary">
                  검색 결과 {results.length}건
                </p>
                {results.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => router.push(`/post/${post.id}`)}
                    className="cursor-pointer rounded-2xl bg-white border border-border p-4 transition-all active:bg-surface"
                  >
                    <div className="mb-2 flex items-center gap-1.5 text-[13px] font-medium text-primary">
                      <MapPinIcon className="h-3.5 w-3.5 text-accent" />
                      {post.location_name}
                    </div>
                    <p className="line-clamp-2 text-sm leading-relaxed text-primary">
                      {post.body}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pt-16 text-center">
                <span className="mb-3 block text-4xl">🔍</span>
                <p className="text-sm text-secondary">
                  &ldquo;{query}&rdquo;에 대한 스침이 없어요
                </p>
              </div>
            )}
          </>
        ) : (
          /* Popular Locations */
          <>
            <h2 className="mb-4 text-base font-semibold text-primary">
              스침이 많은 장소
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_LOCATIONS.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => setQuery(loc.name)}
                  className="flex items-center gap-3 rounded-2xl bg-white border border-border p-4 text-left transition-all active:bg-surface"
                >
                  <span className="text-2xl">{loc.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      {loc.name}
                    </p>
                    <p className="text-xs text-secondary">
                      스침 {loc.count}건
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <h2 className="mb-4 mt-8 text-base font-semibold text-primary">
              최근 인기 태그
            </h2>
            <div className="flex flex-wrap gap-2">
              {["카페", "지하철", "출근길", "공원", "서점", "헬스장", "식당"].map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="rounded-full border border-border-strong px-4 py-2 text-[13px] font-medium text-secondary transition-all active:bg-surface"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
