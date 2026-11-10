import type { Metadata } from "next";
import "../globals.css";
import { ceraPro } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Stats — Sabab Brand Bureau",
  robots: { index: false, follow: false },
};

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={ceraPro.variable}>
      <body>{children}</body>
    </html>
  );
}
