import { ImageResponse } from "next/og";
import { SABAB_PATHS, SABAB_VIEWBOX } from "@/lib/sababPaths";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sabab Brand Bureau";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #782F1E 0%, #4A160C 100%)",
        }}
      >
        <svg width={820} height={198} viewBox={SABAB_VIEWBOX} fill="#EAE2D8">
          {SABAB_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      </div>
    ),
    { ...size },
  );
}
