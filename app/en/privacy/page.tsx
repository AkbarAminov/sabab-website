import PrivacyPage from "@/components/PrivacyPage";
import { getDictionary } from "@/lib/dictionary";

export default function Page() {
  return <PrivacyPage dict={getDictionary("en")} locale="en" />;
}
