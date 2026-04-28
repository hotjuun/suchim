"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import { deletePost } from "@/lib/posts";
import { isAdmin } from "@/lib/admin";
import BottomNav from "@/components/BottomNav";
import { ChevronLeftIcon, MapPinIcon } from "@/components/Icons";
import type { Post } from "@/types";

export default function MyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [matchSuccessCount, setMatchSuccessCount] = useState(0);
  const [activeChatCount, setActiveChatCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    async function load() {
      const [postsRes, matchRes, chatRes] = await Promise.all([
        supabase
          .from("posts")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("match_requests")
          .select("id, post:posts!inner(user_id)", { count: "exact", head: true })
          .eq("status", "accepted")
          .eq("posts.user_id", user!.id),
        supabase
          .from("chat_rooms")
          .select("id", { count: "exact", head: true })
          .or(`user1_id.eq.${user!.id},user2_id.eq.${user!.id}`),
      ]);
      if (postsRes.data) setMyPosts(postsRes.data);
      setMatchSuccessCount(matchRes.count ?? 0);
      setActiveChatCount(chatRes.count ?? 0);
      setLoading(false);
    }
    load();
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-surface border-t-accent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pb-2 pt-3">
        <button
          onClick={() => router.back()}
          className="text-primary"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <span className="text-base font-semibold text-primary">MY</span>
        <div className="w-5" />
      </div>

      <div className="flex-1 px-6 pb-28">
        {/* Profile Section */}
        <div className="mb-8 mt-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface text-3xl">
            🌿
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary">
              {user?.email?.split("@")[0]}
            </h2>
            <p className="text-sm text-secondary">{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 flex gap-3">
          <div className="flex-1 rounded-2xl bg-white p-4 text-center border border-border">
            <p className="text-2xl font-bold text-primary">{myPosts.length}</p>
            <p className="mt-1 text-xs text-secondary">작성한 스침</p>
          </div>
          <div className="flex-1 rounded-2xl bg-white p-4 text-center border border-border">
            <p className="text-2xl font-bold text-accent">{matchSuccessCount}</p>
            <p className="mt-1 text-xs text-secondary">매칭 성공</p>
          </div>
          <div className="flex-1 rounded-2xl bg-white p-4 text-center border border-border">
            <p className="text-2xl font-bold text-primary">{activeChatCount}</p>
            <p className="mt-1 text-xs text-secondary">대화 중</p>
          </div>
        </div>

        {/* My Posts */}
        <h3 className="mb-3 text-sm font-semibold text-primary">내가 쓴 스침</h3>

        {myPosts.length === 0 ? (
          <div className="rounded-2xl bg-white border border-border p-8 text-center">
            <span className="mb-3 block text-4xl">✏️</span>
            <p className="mb-4 text-sm text-secondary">
              아직 작성한 스침이 없어요
            </p>
            <button
              onClick={() => router.push("/write")}
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white"
            >
              첫 스침 남기기
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {myPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl bg-white border border-border p-4"
              >
                <div
                  onClick={() => router.push(`/post/${post.id}`)}
                  className="cursor-pointer"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="inline-flex items-center gap-1 text-[13px] font-medium text-primary">
                      <MapPinIcon className="h-3.5 w-3.5 text-accent" />
                      {post.location_name}
                    </div>
                    <span className="text-xs text-secondary">
                      {post.date_text} {post.time_text}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm leading-relaxed text-primary">
                    {post.body}
                  </p>
                </div>
                <div className="mt-3 flex justify-end border-t border-border pt-3">
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!confirm("이 글을 정말 삭제할까요?")) return;
                      try {
                        await deletePost(post.id);
                        setMyPosts((prev) => prev.filter((p) => p.id !== post.id));
                      } catch {
                        alert("삭제에 실패했어요.");
                      }
                    }}
                    className="text-xs font-semibold text-accent"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Menu */}
        <div className="mt-8 space-y-1">
          {isAdmin(user?.email) && (
            <button
              onClick={() => router.push("/admin/reports")}
              className="w-full rounded-xl bg-accent-light border border-accent/20 px-4 py-3.5 text-left text-sm font-semibold text-accent transition-all active:opacity-80"
            >
              🛡️ 신고 관리 (관리자)
            </button>
          )}
          <button className="w-full rounded-xl bg-white border border-border px-4 py-3.5 text-left text-sm text-primary transition-all active:bg-surface">
            알림 설정
          </button>
          <button
            onClick={() => router.push("/terms")}
            className="w-full rounded-xl bg-white border border-border px-4 py-3.5 text-left text-sm text-primary transition-all active:bg-surface"
          >
            이용약관
          </button>
          <button
            onClick={() => router.push("/privacy")}
            className="w-full rounded-xl bg-white border border-border px-4 py-3.5 text-left text-sm text-primary transition-all active:bg-surface"
          >
            개인정보처리방침
          </button>
          <button
            onClick={handleSignOut}
            className="w-full rounded-xl bg-white border border-border px-4 py-3.5 text-left text-sm text-accent transition-all active:bg-surface"
          >
            로그아웃
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-secondary">
          스침 v0.1.0 MVP
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
