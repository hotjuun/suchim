"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { ChevronLeftIcon, MoreIcon } from "@/components/Icons";
import type { ChatMessage } from "@/types";

export default function ChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: roomId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 메시지 불러오기
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    }
    load();

    // 실시간 구독
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // 새 메시지 시 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !user || sending) return;
    setSending(true);
    const content = input.trim();
    setInput("");

    try {
      await supabase.from("chat_messages").insert({
        room_id: roomId,
        sender_id: user.id,
        content,
      });
    } catch {
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex h-full flex-col bg-bg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 pb-3 pt-3">
        <button
          onClick={() => router.back()}
          className="flex items-center text-primary"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-primary">
            익명의 스침
          </p>
          <p className="text-[11px] text-secondary">매칭된 대화</p>
        </div>
        <button>
          <MoreIcon className="h-5 w-5 text-secondary" />
        </button>
      </div>

      {/* Messages */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="pt-20 text-center">
            <span className="mb-3 block text-4xl">💬</span>
            <p className="text-sm text-secondary">
              첫 메시지를 보내보세요!
              <br />
              스침이 인연으로 이어지는 순간이에요
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMine = msg.sender_id === user?.id;
          const showTime =
            i === messages.length - 1 ||
            messages[i + 1]?.sender_id !== msg.sender_id;

          return (
            <div
              key={msg.id}
              className={`mb-1 flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[75%] ${isMine ? "items-end" : "items-start"}`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                    isMine
                      ? "rounded-tr-md bg-accent text-white"
                      : "rounded-tl-md bg-white text-primary border border-border"
                  }`}
                >
                  {msg.content}
                </div>
                {showTime && (
                  <p
                    className={`mt-1 text-[10px] text-secondary ${isMine ? "text-right" : "text-left"} mb-2`}
                  >
                    {formatTime(msg.created_at)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-white px-4 pb-8 pt-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="메시지를 입력하세요"
            className="flex-1 rounded-full bg-surface px-4 py-3 text-sm text-primary outline-none placeholder:text-secondary focus:ring-2 focus:ring-accent"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-all disabled:opacity-40"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
