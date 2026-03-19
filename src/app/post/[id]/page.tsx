"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { createMatchRequest } from "@/lib/matches";
import {
  ChevronLeftIcon,
  MapPinIcon,
  HeartIcon,
  StarIcon,
  MoreIcon,
} from "@/components/Icons";
import { mockPosts } from "@/lib/mock-data";
import type { Post } from "@/types";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [matchMessage, setMatchMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();
        if (data) {
          setPost(data);
        } else {
          const mock = mockPosts.find((p) => p.id === id);
          if (mock) setPost(mock);
        }
      } catch {
        const mock = mockPosts.find((p) => p.id === id);
        if (mock) setPost(mock);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleMatch = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!matchMessage.trim() || !post) return;

    setSubmitting(true);
    try {
      await createMatchRequest({
        post_id: post.id,
        requester_id: user.id,
        message: matchMessage.trim(),
      });
      setSubmitted(true);
      setShowMatchForm(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "요청에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-surface border-t-accent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-bg px-6">
        <span className="mb-4 text-5xl">🍃</span>
        <p className="text-secondary">글을 찾을 수 없어요</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white"
        >
          피드로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pb-2 pt-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-0.5 text-sm font-medium text-primary"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <span className="text-base font-semibold text-primary">스침</span>
        <button className="flex h-9 w-9 items-center justify-center rounded-full">
          <MoreIcon className="h-5 w-5 text-secondary" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-4">
        {post.is_boosted && (
          <div className="mb-4 inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide text-accent">
            <StarIcon className="h-3 w-3" />
            BOOST
          </div>
        )}

        {/* Location & Time */}
        <div className="mb-4 flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-2 text-sm font-medium text-primary">
            <MapPinIcon className="h-4 w-4 text-accent" />
            {post.location_name}
          </div>
        </div>

        <div className="mb-6 flex gap-3 text-sm text-secondary">
          {post.date_text && <span>{post.date_text}</span>}
          {post.time_text && (
            <>
              <span className="text-border-strong">·</span>
              <span>{post.time_text}</span>
            </>
          )}
        </div>

        {/* Body */}
        <p className="mb-8 text-[16px] leading-[1.85] text-primary">
          {post.body}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-8 flex gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-surface px-3 py-1.5 text-[13px] text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="h-px bg-border" />

        {/* Match Section */}
        {submitted ? (
          <div className="mt-8 text-center">
            <span className="mb-3 block text-4xl">💕</span>
            <h3 className="mb-2 text-lg font-semibold text-primary">
              신청이 전달되었어요
            </h3>
            <p className="text-sm text-secondary">
              상대방이 확인하면 대화가 시작돼요.
              <br />
              조금만 기다려주세요!
            </p>
          </div>
        ) : showMatchForm ? (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-primary">
              본인 확인 메시지
            </h3>
            <p className="mb-3 text-xs text-secondary">
              상대방이 당신을 알아볼 수 있도록 그날 상황을 설명해주세요
            </p>
            <textarea
              value={matchMessage}
              onChange={(e) => setMatchMessage(e.target.value.slice(0, 300))}
              placeholder="그날 제가 어떤 모습이었는지 적어주세요..."
              rows={4}
              className="w-full resize-none rounded-xl border-[1.5px] border-border-strong bg-white px-4 py-3.5 text-[15px] leading-[1.7] text-primary outline-none placeholder:text-[#C7C7CC] focus:border-accent focus:ring-2 focus:ring-accent-light"
            />
            <p className="mt-1 text-right text-xs text-secondary">
              {matchMessage.length} / 300
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowMatchForm(false)}
                className="flex-1 rounded-xl bg-surface py-3.5 text-sm font-semibold text-secondary"
              >
                취소
              </button>
              <button
                onClick={handleMatch}
                disabled={!matchMessage.trim() || submitting}
                className="flex-1 rounded-xl bg-accent py-3.5 text-sm font-semibold text-white transition-all disabled:opacity-50"
              >
                {submitting ? "보내는 중..." : "보내기"}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              if (!user) {
                router.push("/login");
                return;
              }
              setShowMatchForm(true);
            }}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-4 text-base font-semibold text-white shadow-[0_4px_16px_rgba(255,59,92,0.3)] transition-all active:scale-[0.98]"
          >
            <HeartIcon className="h-5 w-5" />
            저인 것 같아요
          </button>
        )}
      </div>
    </div>
  );
}
