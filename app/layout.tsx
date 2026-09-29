import { Cairo } from "next/font/google";
import "./globals.css";

import type { Metadata } from "next";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: {
    default: "كفو ماركت | تسوق ذكي وتوصيل سريع",
    template: "%s | كفو ماركت",
  },
  description: "المتجر الرسمي لكفو ماركت - تسوق ذكي، عروض حصرية، وأفضل تجربة تسوق",
  icons: {
    icon: "/favicon.ico",
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
