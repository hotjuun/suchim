import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "스침 — 스쳐간 순간을 붙잡는 곳",
  description:
    "카페에서, 지하철에서 스쳐간 그 사람. 말을 걸지 못한 순간을 다시 이어주는 곳.",
  manifest: "/manifest.json",
  openGraph: {
    title: "스침 — 스쳐간 순간을 붙잡는 곳",
    description:
      "카페에서, 지하철에서 스쳐간 그 사람. 말을 걸지 못한 순간을 다시 이어주는 곳.",
    siteName: "스침",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "스침 — 스쳐간 순간을 붙잡는 곳",
    description: "너 오늘 스침 했어? 스쳐간 인연을 다시 찾는 곳.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "스침",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FAFAFA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
