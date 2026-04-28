"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@/components/Icons";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-full bg-bg">
      <div className="flex items-center gap-2 px-6 pb-2 pt-3">
        <button onClick={() => router.back()}>
          <ChevronLeftIcon className="h-5 w-5 text-primary" />
        </button>
        <h1 className="text-base font-semibold text-primary">개인정보처리방침</h1>
      </div>

      <div className="px-6 pb-20 pt-4 text-sm leading-[1.8] text-secondary">
        <h2 className="mb-2 text-base font-semibold text-primary">1. 수집하는 개인정보</h2>
        <p className="mb-2">서비스 이용을 위해 다음 정보를 수집합니다:</p>
        <ul className="mb-6 list-disc pl-5 space-y-1">
          <li>필수: 이메일 주소, 비밀번호(암호화 저장)</li>
          <li>소셜 로그인 시: 이메일, 프로필 정보(닉네임)</li>
          <li>자동 수집: 접속 로그, 기기 정보, 접속 IP</li>
        </ul>

        <h2 className="mb-2 text-base font-semibold text-primary">2. 수집 목적</h2>
        <ul className="mb-6 list-disc pl-5 space-y-1">
          <li>회원 가입 및 본인 확인</li>
          <li>서비스 제공 및 운영</li>
          <li>부정 이용 방지</li>
          <li>서비스 개선을 위한 통계 분석</li>
        </ul>

        <h2 className="mb-2 text-base font-semibold text-primary">3. 보유 및 이용 기간</h2>
        <p className="mb-6">
          회원 탈퇴 시 즉시 파기합니다. 단, 관계 법령에 따라 보존이 필요한 경우
          해당 기간 동안 보관합니다. (전자상거래법: 계약 기록 5년, 접속 기록 3개월)
        </p>

        <h2 className="mb-2 text-base font-semibold text-primary">4. 제3자 제공</h2>
        <p className="mb-6">
          수집된 개인정보는 원칙적으로 제3자에게 제공하지 않습니다.
          단, 법령에 의한 요청이 있는 경우 예외로 합니다.
        </p>

        <h2 className="mb-2 text-base font-semibold text-primary">5. 위탁</h2>
        <p className="mb-2">서비스 운영을 위해 다음 업체에 처리를 위탁합니다:</p>
        <ul className="mb-6 list-disc pl-5 space-y-1">
          <li>Supabase (데이터베이스, 인증 처리)</li>
          <li>Vercel (웹 호스팅)</li>
          <li>Google Analytics (이용 통계 분석)</li>
        </ul>

        <h2 className="mb-2 text-base font-semibold text-primary">6. 이용자의 권리</h2>
        <p className="mb-6">
          이용자는 언제든지 본인의 개인정보를 조회, 수정, 삭제할 수 있으며,
          회원 탈퇴를 통해 개인정보 처리를 거부할 수 있습니다.
        </p>

        <h2 className="mb-2 text-base font-semibold text-primary">7. 문의</h2>
        <p className="mb-6">
          개인정보 관련 문의는 서비스 내 문의 기능 또는 이메일을 통해 접수할 수 있습니다.
        </p>

        <p className="text-xs text-secondary/60">시행일: 2025년 3월 31일</p>
      </div>
    </div>
  );
}
