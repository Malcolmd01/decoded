import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const headline = localFont({
  src: [
    {
      path: "../../public/fonts/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--next-font-headline",
  display: "swap",
});

const body = localFont({
  src: [
    {
      path: "../../public/fonts/Aileron-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Aileron-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--next-font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Decoded",
  description: "Decoded — events and conversations.",
  icons: { icon: "/red-logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headline.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-black text-black">
        {children}
      </body>
    </html>
  );
}
