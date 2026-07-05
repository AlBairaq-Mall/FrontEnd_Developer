import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "البيرق ماركت - نظام الإدارة المتكامل",
  description: "الحل الأمثل لإدارة متجرك الإلكتروني بكفاءة عالية.",
  openGraph: {
    title: "البيرق ماركت - نظام الإدارة المتكامل",
    description: "الحل الأمثل لإدارة متجرك الإلكتروني بكفاءة عالية.",
    siteName: "البيرق ماركت",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "شعار البيرق ماركت",
      },
    ],
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "البيرق ماركت - نظام الإدارة المتكامل",
    description: "الحل الأمثل لإدارة متجرك الإلكتروني بكفاءة عالية.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-gray-50 font-cairo">
        {children}
      </body>
    </html>
  );
}
