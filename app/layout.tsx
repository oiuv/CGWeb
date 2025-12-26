import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "魔力宝贝 CrossGate - 用户中心",
  description: "魔力宝贝开源游戏用户中心",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen bg-gradient-to-br from-background via-[#fff5e6] to-[#ffe8f0]">
        {children}
      </body>
    </html>
  );
}
