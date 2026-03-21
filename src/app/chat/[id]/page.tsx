"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import PaywallModal from "@/components/PaywallModal";
import CoinModal from "@/components/CoinModal";
import { ChevronLeftIcon, MoreIcon } from "@/components/Icons";
import { DAILY_LIMITS, COIN_PRICES, getCoinBalance, spendCoins, addCoins, containsContactInfo } from "@/lib/coins";
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
  const [balance, setBalance] = useState(0);
  const [showContactPaywall, setShowContactPaywall] = useState(false);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [contactBlocked, setContactBlocked] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const myMessageCount = messages.filter((m) => m.sender_id === user?.id).length;
  const isLimitReached = myMessageCount >= DAILY_LIMITS.CHAT_MESSAGES;

  useEffect(() => {
    if (user) getCoinBalance(user.id).then(setBalance);
  }, [user]);

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !user || sending) return;

    // 연락처 패턴 감지
    if (containsContactInfo(input)) {
      setContactBlocked(true);
      setTimeout(() => setContactBlocked(false), 3000);
      return;
    }

    // 메시지 제한 확인
    if (isLimitReached) return;

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

  const handleContactExchange = async () => {
    if (!user) return;
    const success = await spendCoins(user.id, COIN_PRICES.CONTACT_EXCHANGE, "연락처 교환");
    if (success) {
      setShowContactPaywall(false);
      setBalance((b) => b - COIN_PRICES.CONTACT_EXCHANGE);
      // 연락처 교환 성공 → 메시지 제한 해제 + 연락처 전송 허용
      await supabase.from("chat_messages").insert({
        room_id: roomId,
        sender_id: user.id,
        content: "💌 연락처 교환권을 사용했습니다. 이제 연락처를 자유롭게 공유할 수 있어요!",
      });
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
          <p className="text-sm font-semibold text-primary">익명의 스침</p>
          <p className="text-[11px] text-secondary">
            메시지 {myMessageCount}/{DAILY_LIMITS.CHAT_MESSAGES}
          </p>
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
              <div
                className={`max-w-[75%] ${isMine ? "items-end" : "items-start"}`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                    isMine
                      ? "rounded-tr-md bg-accent text-white"
                      : "rounded-tl-md border border-border bg-white text-primary"
                  }`}
                >
                  {msg.content}
                </div>
                {showTime && (
                  <p
                    className={`mb-2 mt-1 text-[10px] text-secondary ${isMine ? "text-right" : "text-left"}`}
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

      {/* Contact blocked warning */}
      {contactBlocked && (
        <div className="mx-4 mb-2 rounded-xl bg-accent-light p-3 text-center">
          <p className="text-xs font-medium text-accent">
            연락처는 교환권을 사용해야 공유할 수 있어요
          </p>
          <button
            onClick={() => setShowContactPaywall(true)}
            className="mt-1 text-xs font-bold text-accent underline"
          >
            연락처 교환권 사용하기 (39코인)
          </button>
        </div>
      )}

      {/* Message limit reached */}
      {isLimitReached && (
        <div className="mx-4 mb-2 rounded-xl bg-surface p-4 text-center">
          <p className="mb-2 text-sm font-semibold text-primary">
            메시지를 모두 사용했어요
          </p>
          <p className="mb-3 text-xs text-secondary">
            이 인연을 일상으로 이어가시겠어요?
          </p>
          <button
            onClick={() => setShowContactPaywall(true)}
            className="rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-white"
          >
            💌 연락처 교환하기
          </button>
        </div>
      )}

      {/* Contact exchange button (after 10 messages) */}
      {myMessageCount >= 10 && !isLimitReached && (
        <div className="mx-4 mb-2">
          <button
            onClick={() => setShowContactPaywall(true)}
            className="w-full rounded-xl border border-accent/20 bg-accent-light py-2.5 text-sm font-semibold text-accent"
          >
            💌 연락처 교환하기
          </button>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border bg-white px-4 pb-8 pt-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={
              isLimitReached
                ? "메시지 한도에 도달했어요"
                : "메시지를 입력하세요"
            }
            disabled={isLimitReached}
            className="flex-1 rounded-full bg-surface px-4 py-3 text-sm text-primary outline-none placeholder:text-secondary focus:ring-2 focus:ring-accent disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending || isLimitReached}
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

      {/* Paywall Modals */}
      <PaywallModal
        isOpen={showContactPaywall}
        onClose={() => setShowContactPaywall(false)}
        title="이 인연을, 일상으로 이어가시겠어요?"
        description="연락처 교환권을 사용하면 카톡, 인스타 등 연락처를 자유롭게 공유할 수 있어요."
        emoji="💌"
        coinCost={COIN_PRICES.CONTACT_EXCHANGE}
        balance={balance}
        onPay={handleContactExchange}
        onBuyCoins={() => {
          setShowContactPaywall(false);
          setShowCoinModal(true);
        }}
      />

      <CoinModal
        isOpen={showCoinModal}
        onClose={() => setShowCoinModal(false)}
        balance={balance}
        onPurchase={async (coins) => {
          if (user) {
            await addCoins(user.id, coins, "코인 충전");
            setBalance((b) => b + coins);
          }
        }}
      />
    </div>
  );
}
