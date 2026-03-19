"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PostWithMeta } from "@/types";
import { MapPinIcon, HeartIcon, StarIcon } from "./Icons";

export default function PostCard({ post }: { post: PostWithMeta }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);

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

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition-all active:scale-95 ${
              liked
                ? "bg-accent text-white shadow-[0_4px_12px_rgba(255,59,92,0.3)]"
                : "bg-accent-light text-accent"
            }`}
          >
            <HeartIcon
              className="h-4 w-4"
              style={liked ? { fill: "currentColor" } : undefined}
            />
            {liked ? "신청 완료" : "저예요"}
          </button>
        </div>
      </div>
    </article>
  );
}
