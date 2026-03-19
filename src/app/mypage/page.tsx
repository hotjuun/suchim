"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import BottomNav from "@/components/BottomNav";
import { ChevronLeftIcon, MapPinIcon } from "@/components/Icons";
import type { Post } from "@/types";

export default function MyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    async function load() {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (data) setMyPosts(data);
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
            <p className="text-2xl font-bold text-accent">0</p>
            <p className="mt-1 text-xs text-secondary">매칭 성공</p>
          </div>
          <div className="flex-1 rounded-2xl bg-white p-4 text-center border border-border">
            <p className="text-2xl font-bold text-primary">0</p>
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
                onClick={() => router.push(`/post/${post.id}`)}
                className="cursor-pointer rounded-2xl bg-white border border-border p-4 transition-all active:bg-surface"
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
            ))}
          </div>
        )}

        {/* Menu */}
        <div className="mt-8 space-y-1">
          <button className="w-full rounded-xl bg-white border border-border px-4 py-3.5 text-left text-sm text-primary transition-all active:bg-surface">
            알림 설정
          </button>
          <button className="w-full rounded-xl bg-white border border-border px-4 py-3.5 text-left text-sm text-primary transition-all active:bg-surface">
            이용약관
          </button>
          <button className="w-full rounded-xl bg-white border border-border px-4 py-3.5 text-left text-sm text-primary transition-all active:bg-surface">
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
