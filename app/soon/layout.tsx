import type { Metadata } from "next";
import "../globals.css";
import { ceraPro } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Sabab Brand Bureau",
  robots: { index: false, follow: false },
};

export default function SoonLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={ceraPro.variable}>
      <body>{children}</body>
    </html>
  );
}
