import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 행동 심리학 코칭",
  description: "실전에서 바로 쓰는 행동 전략 AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-adsense-account" content="ca-pub-7868027691486706" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
