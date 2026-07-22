import type { Metadata } from "next";
import { Footer } from "../common/Footer";
import { GoogleAnalytics } from "../common/GoogleAnalytics";
import { Header } from "../common/Header";
import { pretendard } from "../fonts";
import "./globals.css";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://ssu-it-landing.vercel.app"),
  title: {
    default: "숭실대학교 IT지원위원회",
    template: "%s | 숭실대학교 IT지원위원회",
  },
  description:
    "숭실대학교 IT지원위원회 공식 홈페이지 - 학생들의 불편함을 IT 기술로 해결합니다.",
  keywords: [
    "숭실대학교",
    "IT지원위원회",
    "숭실대 IT",
    "숭실대 개발",
    "숭실대 기획",
    "SSU IT",
  ],
  authors: [{ name: "숭실대학교 IT지원위원회" }],
  openGraph: {
    title: "숭실대학교 IT지원위원회",
    description:
      "숭실대학교 IT지원위원회 공식 홈페이지 - 학생들의 불편함을 IT 기술로 해결합니다.",
    siteName: "숭실대학교 IT지원위원회",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "숭실대학교 IT지원위원회",
    description:
      "숭실대학교 IT지원위원회 공식 홈페이지 - 학생들의 불편함을 IT 기술로 해결합니다.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full antialiased ${pretendard.variable}`}>
      <body className="min-h-full flex flex-col">
        {GA_MEASUREMENT_ID && (
          <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
        )}
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
