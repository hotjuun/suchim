"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { respondToMatch } from "@/lib/matches";

const TABS = ["새로운", "대화 중", "지난 스침"];

const EMOJIS = ["🌿", "🌸", "🍀", "🌊", "🌙", "✨", "🦋", "🌻"];
function hashEmoji(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return EMOJIS[Math.abs(h) % EMOJIS.length];
}

interface MatchItem {
  id: string;
  created_at: string;
  post_id: string;
  requester_id: string;
  message: string;
  status: string;
  post: {
    id: string;
    body: string;
    location_name: string;
    date_text: string;
    time_text: string;
    user_id: string;
  };
}

interface ChatItem {
  id: string;
  user1_id: string;
  user2_id: string;
  post: { location_name: string };
  created_at: string;
}

export default function MatchesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    async function load() {
      // 내가 쓴 글에 온 pending 매칭
      const { data: matchData } = await supabase
        .from("match_requests")
        .select("*, post:posts(*)")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (matchData) {
        // 내 글에 온 요청만 필터
        setMatches(
          matchData.filter((m: MatchItem) => m.post?.user_id === user!.id)
        );
      }

      // 내 채팅방들
      const { data: chatData } = await supabase
        .from("chat_rooms")
        .select("*, post:posts(location_name)")
        .or(`user1_id.eq.${user!.id},user2_id.eq.${user!.id}`)
        .order("created_at", { ascending: false });

      if (chatData) setChats(chatData);
      setLoading(false);
    }
    load();
  }, [user, authLoading]);

  const handleRespond = async (matchId: string, accept: boolean) => {
    if (!user) return;
    try {
      await respondToMatch(matchId, accept, user.id);
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
      if (accept) {
        // 채팅방 목록 갱신
        const { data } = await supabase
          .from("chat_rooms")
          .select("*, post:posts(location_name)")
          .or(`user1_id.eq.${user!.id},user2_id.eq.${user!.id}`)
          .order("created_at", { ascending: false });
        if (data) setChats(data);
        setActiveTab(1);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "오류가 발생했습니다");
    }
  };

  if (!authLoading && !user) {
    return (
      <div className="flex min-h-full flex-col bg-bg">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <span className="mb-4 text-5xl">💕</span>
          <h3 className="mb-2 text-base font-semibold text-primary">
            로그인이 필요해요
          </h3>
          <p className="mb-6 text-sm text-secondary">
            매칭 내역을 보려면 로그인해주세요
          </p>
          <button
            onClick={() => router.push("/login")}
            className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white"
          >
            로그인
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

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
              activeTab === i ? "font-semibold text-primary" : "text-secondary"
            }`}
          >
            {tab}
            {i === 0 && matches.length > 0 && (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-white">
                {matches.length}
              </span>
            )}
            {i === 1 && chats.length > 0 && (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#34C759] px-1.5 text-[11px] font-bold text-white">
                {chats.length}
              </span>
            )}
            {activeTab === i && (
              <span className="absolute bottom-[-1px] left-5 right-5 h-0.5 rounded-sm bg-primary" />
            )}
          </button>
        ))}
      </div>

      <main className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-5 pb-28 pt-4">
        {loading ? (
          <div className="flex justify-center pt-16">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-surface border-t-accent" />
          </div>
        ) : activeTab === 0 ? (
          <>
            {matches.length === 0 ? (
              <div className="flex flex-col items-center pt-16 text-center">
                <span className="mb-4 text-5xl">🍃</span>
                <h3 className="mb-2 text-base font-semibold text-primary">
                  아직 새로운 매칭이 없어요
                </h3>
                <p className="text-sm leading-relaxed text-secondary">
                  글을 올리고 기다려보세요
                  <br />
                  그 사람도 당신을 찾고 있을지 몰라요
                </p>
                <button
                  onClick={() => router.push("/write")}
                  className="mt-5 rounded-3xl bg-primary px-7 py-3 text-sm font-semibold text-white"
                >
                  글 쓰러 가기
                </button>
              </div>
            ) : (
              matches.map((match) => (
                <div
                  key={match.id}
                  className="overflow-hidden rounded-[20px] border border-border bg-white"
                >
                  <div className="p-[18px] pb-3.5">
                    <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-md bg-accent-light px-2.5 py-1 text-[11px] font-semibold text-accent">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      NEW
                    </div>
                    <p className="mb-2 border-l-[3px] border-surface pl-3 text-sm leading-relaxed text-primary">
                      &ldquo;{match.post.body.slice(0, 60)}...&rdquo;
                    </p>
                    <p className="text-xs text-secondary">
                      내가 쓴 글 · {match.post.location_name}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 border-t border-border bg-surface px-[18px] py-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white text-xl">
                      {hashEmoji(match.requester_id)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[13px] font-semibold text-primary">
                        익명의 스침 #{match.requester_id.slice(-4)}
                      </h4>
                      <p className="truncate text-xs text-secondary">
                        &ldquo;{match.message.slice(0, 40)}...&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 p-[18px] pt-3.5">
                    <button
                      onClick={() => handleRespond(match.id, false)}
                      className="flex-1 rounded-xl bg-surface py-3 text-sm font-semibold text-secondary"
                    >
                      아닌 것 같아요
                    </button>
                    <button
                      onClick={() => handleRespond(match.id, true)}
                      className="flex-1 rounded-xl bg-accent py-3 text-sm font-semibold text-white"
                    >
                      맞아요!
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        ) : activeTab === 1 ? (
          <>
            {chats.length === 0 ? (
              <div className="flex flex-col items-center pt-16 text-center">
                <span className="mb-4 text-5xl">💬</span>
                <h3 className="mb-2 text-base font-semibold text-primary">
                  아직 대화 중인 스침이 없어요
                </h3>
                <p className="text-sm text-secondary">
                  매칭이 성사되면 여기서 대화할 수 있어요
                </p>
              </div>
            ) : (
              chats.map((chat) => {
                const otherId =
                  chat.user1_id === user?.id ? chat.user2_id : chat.user1_id;
                return (
                  <div
                    key={chat.id}
                    onClick={() => router.push(`/chat/${chat.id}`)}
                    className="flex cursor-pointer items-center gap-3.5 rounded-[20px] border border-border bg-white p-4 transition-all active:bg-surface"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface text-2xl">
                      {hashEmoji(otherId)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-primary">
                        {chat.post?.location_name} · #{otherId.slice(-4)}
                      </h4>
                      <p className="text-[13px] text-secondary">
                        대화를 시작해보세요
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </>
        ) : (
          <div className="flex flex-col items-center pt-16 text-center">
            <span className="mb-4 text-5xl">📚</span>
            <h3 className="mb-2 text-base font-semibold text-primary">
              지난 스침이 없어요
            </h3>
            <p className="text-sm text-secondary">
              종료된 대화가 여기에 보관돼요
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
