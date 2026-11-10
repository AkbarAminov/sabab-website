import localFont from "next/font/local";

// Brand typeface (licensed, not on Google Fonts) — files live in
// public/font/. Only the weights/styles actually used across the site are
// registered: 400/700 normal + 400/700 italic for body text and the title's
// <em>, 500 for buttons and links.
export const ceraPro = localFont({
  src: [
    { path: "../public/font/CeraPro-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/font/CeraPro-Italic.ttf", weight: "400", style: "italic" },
    { path: "../public/font/CeraPro-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/font/CeraPro-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "../public/font/CeraPro-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/font/CeraPro-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-cera",
  display: "swap",
});
