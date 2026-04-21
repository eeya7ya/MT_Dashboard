import type { Metadata, Viewport } from "next";
import { Kalam, Patrick_Hand } from "next/font/google";
import "./globals.css";

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-kalam",
  display: "swap",
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-patrick",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Magic Tech · Presales Hub",
  description:
    "Internal presales hub for Magic Tech — launch the Quotation Designer, Pricing Sheets, and partner tools across light-current, IT, and home-automation lines.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e9e5dc",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${kalam.variable} ${patrickHand.variable}`}>
        {children}
      </body>
    </html>
  );
}
