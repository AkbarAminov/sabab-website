"use client";

import { track } from "@vercel/analytics";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/dictionary";
import { pdfHref } from "@/lib/links";
import type { PdfKind } from "@/lib/pdf";

export default function PdfLink({
  kind,
  locale,
  className,
  children,
}: {
  kind: PdfKind;
  locale: Locale;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={pdfHref(kind, locale)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track("pdf_open", { kind, locale })}
    >
      {children}
    </a>
  );
}
