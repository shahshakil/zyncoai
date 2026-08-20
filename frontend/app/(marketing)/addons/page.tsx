import type { Metadata } from "next";
import { AddOnsSection } from "@/components/marketing/receptionist/AddOnsSection";

export const metadata: Metadata = {
  title: "Add-ons",
  description: "Optional extras to supercharge your ZyncoAI AI receptionist plan.",
  alternates: { canonical: "/addons" },
};

export default function AddOnsPage() {
  return (
    <div className="bg-[#f8fafc] pt-8">
      <AddOnsSection />
    </div>
  );
}
