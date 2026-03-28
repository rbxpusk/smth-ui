import { TocProvider } from "@/components/docs/DocsContext";
import { DocsLayoutClient } from "@/components/docs/DocsLayoutClient";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <TocProvider>
      <DocsLayoutClient>{children}</DocsLayoutClient>
    </TocProvider>
  );
}
