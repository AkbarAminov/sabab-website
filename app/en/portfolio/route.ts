import { servePdf } from "@/lib/pdf";

export async function GET() {
  return servePdf("portfolio", "en");
}
