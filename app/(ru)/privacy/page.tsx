import PrivacyPage from "@/components/PrivacyPage";
import { getDictionary } from "@/lib/dictionary";

export default function Page() {
  return <PrivacyPage dict={getDictionary("ru")} locale="ru" />;
}
