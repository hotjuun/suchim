"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@/components/Icons";

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-full bg-bg">
      <div className="flex items-center gap-2 px-6 pb-2 pt-3">
        <button onClick={() => router.back()}>
          <ChevronLeftIcon className="h-5 w-5 text-primary" />
        </button>
        <h1 className="text-base font-semibold text-primary">이용약관</h1>
      </div>

      <div className="px-6 pb-20 pt-4 text-sm leading-[1.8] text-secondary">
        <h2 className="mb-2 text-base font-semibold text-primary">제1조 (목적)</h2>
        <p className="mb-6">
          이 약관은 스침(이하 &ldquo;서비스&rdquo;)이 제공하는 모든 서비스의 이용 조건 및 절차,
          회원과 서비스 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
        </p>

        <h2 className="mb-2 text-base font-semibold text-primary">제2조 (서비스 내용)</h2>
        <p className="mb-6">
          스침은 일상에서 스쳐간 인연을 글로 남기고, 상대방이 확인하면 익명 채팅을 통해
          대화할 수 있는 플랫폼입니다. 서비스는 무료로 제공되며, 일부 부가 기능은
          유료로 제공될 수 있습니다.
        </p>

        <h2 className="mb-2 text-base font-semibold text-primary">제3조 (회원 가입)</h2>
        <p className="mb-6">
          회원 가입은 이메일 또는 소셜 로그인을 통해 가능하며, 만 14세 이상인 자에 한합니다.
          회원은 정확한 정보를 제공해야 하며, 타인의 정보를 도용하여 가입할 수 없습니다.
        </p>

        <h2 className="mb-2 text-base font-semibold text-primary">제4조 (금지 행위)</h2>
        <p className="mb-2">회원은 다음 행위를 해서는 안 됩니다:</p>
        <ul className="mb-6 list-disc pl-5 space-y-1">
          <li>타인의 개인정보(실명, 전화번호, SNS 아이디 등)를 글에 게시하는 행위</li>
          <li>욕설, 비방, 성희롱 등 상대방에게 불쾌감을 주는 행위</li>
          <li>영리 목적의 광고 게시</li>
          <li>허위 사실을 유포하는 행위</li>
          <li>서비스의 정상 운영을 방해하는 행위</li>
        </ul>

        <h2 className="mb-2 text-base font-semibold text-primary">제5조 (게시물 관리)</h2>
        <p className="mb-6">
          서비스는 금지 행위에 해당하는 게시물을 사전 통보 없이 삭제할 수 있으며,
          반복 위반 시 회원 자격을 제한할 수 있습니다.
        </p>

        <h2 className="mb-2 text-base font-semibold text-primary">제6조 (면책)</h2>
        <p className="mb-6">
          서비스는 회원 간의 만남이나 대화에서 발생하는 문제에 대해 책임을 지지 않습니다.
          회원은 자신의 안전에 유의하여 서비스를 이용해야 합니다.
        </p>

        <h2 className="mb-2 text-base font-semibold text-primary">제7조 (약관 변경)</h2>
        <p className="mb-6">
          서비스는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내에
          공지함으로써 효력이 발생합니다.
        </p>

        <p className="text-xs text-secondary/60">시행일: 2025년 3월 31일</p>
      </div>
    </div>
  );
}
