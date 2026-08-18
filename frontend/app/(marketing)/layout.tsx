import { MK } from "@/styles/marketingTokens";
import type { ReactNode } from "react";
import MainHeader from "@/components/navigation/MainHeader";
import MarketingMegaFooter from "@/components/marketing/footer/MarketingMegaFooter";
import { HelpWidgetLoader } from "@/components/marketing/receptionist/HelpWidgetLoader";

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="zynco-bg min-h-screen text-[rgb(var(--text))]">
      <MainHeader />

      <main className="pt-16">
  <div className={MK.container}>
    {children}
  </div>
</main>

      <MarketingMegaFooter />
      <HelpWidgetLoader />
    </div>
  );
}
