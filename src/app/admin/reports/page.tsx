"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { isAdmin } from "@/lib/admin";
import { getReports } from "@/lib/reports";
import { deletePost } from "@/lib/posts";
import { ChevronLeftIcon, MapPinIcon } from "@/components/Icons";
import type { Post } from "@/types";

interface Report {
  id: string;
  created_at: string;
  reporter_id: string;
  post_id: string;
  reason: string;
  details?: string;
  status: string;
  post: Post | null;
}

export default function AdminReportsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin(user.email)) {
      router.push("/");
      return;
    }

    async function load() {
      try {
        const data = await getReports();
        setReports((data as Report[]) || []);
      } catch {
        setReports([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, authLoading, router]);

  const handleDeletePost = async (postId: string) => {
    if (!confirm("이 글을 삭제할까요?")) return;
    try {
      await deletePost(postId);
      setReports((prev) =>
        prev.map((r) =>
          r.post_id === postId ? { ...r, post: null } : r
        )
      );
      alert("글이 삭제되었어요");
    } catch {
      alert("삭제에 실패했어요");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-surface border-t-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-bg">
      <div className="flex items-center gap-3 px-6 pb-2 pt-3">
        <button onClick={() => router.back()}>
          <ChevronLeftIcon className="h-5 w-5 text-primary" />
        </button>
        <h1 className="text-base font-semibold text-primary">신고 관리</h1>
      </div>

      <div className="px-6 pb-20 pt-4">
        <p className="mb-4 text-xs text-secondary">
          접수된 신고 {reports.length}건
        </p>

        {reports.length === 0 ? (
          <div className="rounded-2xl bg-white border border-border p-8 text-center">
            <span className="mb-3 block text-4xl">🌿</span>
            <p className="text-sm text-secondary">접수된 신고가 없어요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="rounded-2xl bg-white border border-border p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-lg bg-accent-light px-2.5 py-1 text-xs font-semibold text-accent">
                    {report.reason}
                  </span>
                  <span className="text-xs text-secondary">
                    {new Date(report.created_at).toLocaleString("ko-KR")}
                  </span>
                </div>

                {report.details && (
                  <p className="mb-3 rounded-lg bg-surface px-3 py-2 text-xs text-secondary">
                    {report.details}
                  </p>
                )}

                {report.post ? (
                  <>
                    <div className="rounded-xl border border-border bg-surface p-3">
                      <div className="mb-2 inline-flex items-center gap-1 text-[12px] font-medium text-primary">
                        <MapPinIcon className="h-3 w-3 text-accent" />
                        {report.post.location_name}
                      </div>
                      <p className="line-clamp-2 text-xs leading-relaxed text-primary">
                        {report.post.body}
                      </p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => router.push(`/post/${report.post!.id}`)}
                        className="flex-1 rounded-xl bg-surface py-2.5 text-xs font-semibold text-primary"
                      >
                        글 보기
                      </button>
                      <button
                        onClick={() => handleDeletePost(report.post!.id)}
                        className="flex-1 rounded-xl bg-accent py-2.5 text-xs font-semibold text-white"
                      >
                        글 삭제
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="rounded-xl bg-surface px-3 py-2 text-xs text-secondary">
                    이 글은 이미 삭제되었어요
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
