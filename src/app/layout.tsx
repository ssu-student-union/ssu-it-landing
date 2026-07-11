import type { Metadata } from "next";
import { Footer } from "../common/Footer";
import { Header } from "../common/Header";
import { pretendard } from "../fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "숭실대학교 IT지원위원회",
  description: "숭실대학교 IT지원위원회 공식 홈페이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full antialiased ${pretendard.variable}`}>
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
