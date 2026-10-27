import HomePage from "@/components/HomePage";
import { getDictionary } from "@/lib/dictionary";

export default function Page() {
  return <HomePage dict={getDictionary("uz")} locale="uz" />;
}
