import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "다트 여행 — 오늘은 어디로?",
  description: "다트를 던져 랜덤 국내 여행지를 추천받아요",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
