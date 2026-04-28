"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import type { PostWithMeta } from "@/types";
import { MapPinIcon, HeartIcon, StarIcon, ShareIcon } from "./Icons";

export default function PostCard({ post }: { post: PostWithMeta }) {
  const router = useRouter();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post.id}`;
    const text = `"${post.body.slice(0, 60)}..." — 혹시 나를 찾고 있는 건 아닐까요?`;

    if (navigator.share) {
      await navigator.share({ title: `스침 · ${post.location_name}`, text, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article
      onClick={() => router.push(`/post/${post.id}`)}
      className={`cursor-pointer rounded-[20px] border bg-white transition-all active:scale-[0.99] ${
        post.is_boosted ? "border-accent/20" : "border-border"
      }`}
    >
      <div className="p-5">
        {post.is_boosted && (
          <div className="mb-2.5 inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide text-accent">
            <StarIcon className="h-3 w-3" />
            BOOST
          </div>
        )}

        <div className="mb-3 flex items-start justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-[13px] font-medium text-primary">
            <MapPinIcon className="h-3.5 w-3.5 text-accent" />
            {post.location_name}
          </div>
          <span className="text-xs text-secondary">{post.time_ago}</span>
        </div>

        <p className="mb-4 line-clamp-3 text-[15px] leading-[1.7] text-primary">
          {post.body}
        </p>

        <div className="h-px bg-border" />

        <div className="flex items-center justify-between pt-3.5">
          <div className="flex gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-surface px-2.5 py-1 text-xs text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1 rounded-full border border-border px-3 py-2 text-[12px] font-medium text-secondary transition-all active:scale-95"
            >
              <ShareIcon className="h-3.5 w-3.5" />
              {copied ? "복사됨!" : "공유"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!user) {
                  router.push("/login");
                  return;
                }
                router.push(`/post/${post.id}`);
              }}
              className="flex items-center gap-1.5 rounded-full bg-accent-light px-4 py-2 text-[13px] font-semibold text-accent transition-all active:scale-95"
            >
              <HeartIcon className="h-4 w-4" />
              저예요
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
