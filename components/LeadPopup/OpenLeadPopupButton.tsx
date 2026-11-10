"use client";

import type { ReactNode } from "react";
import { useLeadPopup } from "./LeadPopupContext";

export default function OpenLeadPopupButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { open } = useLeadPopup();
  return (
    <button type="button" className={className} onClick={open}>
      {children}
    </button>
  );
}
