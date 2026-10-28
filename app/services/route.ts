import { servePdf } from "@/lib/pdf";

export async function GET(request: Request) {
  return servePdf("services", "ru", request);
}
