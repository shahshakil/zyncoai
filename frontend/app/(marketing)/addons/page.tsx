import type { Metadata } from "next";
import { AddOnsSection } from "@/components/marketing/receptionist/AddOnsSection";

export const metadata: Metadata = {
  title: "Add-ons | ZyncoAI",
  description: "Optional extras to supercharge your ZyncoAI AI receptionist plan.",
};

export default function AddOnsPage() {
  return (
    <div className="bg-[#f8fafc] pt-8">
      <AddOnsSection />
    </div>
  );
}
