import { ChildProvider } from "@/lib/childContext";
import ChildControls from "@/components/ChildControls";

export default function KidsLayout({ children }: { children: React.ReactNode }) {
  return <ChildProvider><ChildControls />{children}</ChildProvider>;
}
