import { servePdf } from "@/lib/pdf";

export async function GET() {
  return servePdf("services", "uz");
}
