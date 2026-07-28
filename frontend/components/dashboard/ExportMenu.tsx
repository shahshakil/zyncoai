"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Download, FileSpreadsheet, FileText, FileDown, Printer, Loader2 } from "lucide-react";
import { toast } from "sonner";
import posthog from "posthog-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import {
  exportToExcel,
  exportToCsv,
  triggerPrint,
  logExport,
  hasAckedExportConsent,
  ackExportConsent,
  type ExportSheet,
  type ExportMeta,
} from "@/lib/exportUtils";

type ExportFormatKey = "excel" | "csv" | "pdf" | "print";

export interface ExportMenuProps {
  section: string; // audit-log label, e.g. "patients", "appointments"
  filename: string; // without extension
  meta: ExportMeta;
  // Fetches (or returns already-loaded) sheet data fresh on every export —
  // the FULL matching dataset, not just whatever page of results is on
  // screen. Called for all four actions since PDF/Print need it too (to
  // populate the page's hidden .print-only block via onRowsReady).
  loadSheets: () => Promise<ExportSheet[]>;
  // Lets the calling page push freshly-loaded rows into its own React state
  // so a `.print-only` block can render them before window.print() fires.
  // Not needed for CSV/Excel — those consume the sheets directly.
  onRowsReady?: (sheets: ExportSheet[]) => void;
  formats?: ExportFormatKey[]; // restrict which menu items show (default: all four)
  disabled?: boolean;
  disabledReason?: string;
  className?: string;
}

const FORMAT_ITEMS: Record<ExportFormatKey, { icon: any; label: string; iconColor: string }> = {
  excel: { icon: FileSpreadsheet, label: "📊 Export to Excel", iconColor: "text-emerald-600" },
  csv: { icon: FileText, label: "📄 Export to CSV", iconColor: "text-slate-500" },
  pdf: { icon: FileDown, label: "📋 Export to PDF", iconColor: "text-rose-500" },
  print: { icon: Printer, label: "🖨️ Print", iconColor: "text-slate-500" },
};

// Floating "Export" button + dropdown, dropped into every dashboard table/
// report. Excel and CSV are generated entirely client-side from data the
// role-scoped API already returned — there is nothing here that can expose
// more than the page itself shows (loadSheets always hits the same
// role/doctor-scoped endpoints the page's own view uses). Print/PDF both
// just open the browser's print dialog (per the specified approach); PDF
// only differs by nudging the user to pick "Save as PDF" as the
// destination, since a webpage can't force that choice itself.
export function ExportMenu({ section, filename, meta, loadSheets, onRowsReady, formats, disabled, disabledReason, className }: ExportMenuProps) {
  const [consentOpen, setConsentOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [loading, setLoading] = useState<ExportFormatKey | null>(null);

  function runOrAskConsent(action: () => void) {
    if (hasAckedExportConsent()) {
      action();
      return;
    }
    setPendingAction(() => action);
    setConsentOpen(true);
  }

  function confirmConsent() {
    ackExportConsent();
    setConsentOpen(false);
    pendingAction?.();
    setPendingAction(null);
  }

  async function withData(kind: ExportFormatKey, run: (sheets: ExportSheet[]) => void) {
    setLoading(kind);
    try {
      const sheets = await loadSheets();
      if (!sheets.length || !sheets[0].rows.length) {
        toast.info("Nothing to export yet");
        return;
      }
      run(sheets);
      logExport(section, kind, sheets[0].rows.length);
      posthog.capture("export_downloaded", { type: section, format: kind });
    } catch {
      toast.error("Couldn't load data to export");
    } finally {
      setLoading(null);
    }
  }

  function doExcel() {
    withData("excel", (sheets) => {
      exportToExcel(sheets, meta, filename);
      toast.success("Excel file downloaded");
    });
  }

  function doCsv() {
    withData("csv", (sheets) => {
      exportToCsv(sheets[0].columns, sheets[0].rows, filename);
      toast.success("CSV file downloaded");
    });
  }

  function doPrintLike(kind: "pdf" | "print") {
    withData(kind, (sheets) => {
      onRowsReady?.(sheets);
      // Give React a paint cycle to render the freshly-populated
      // .print-only block before the (blocking) print dialog opens.
      requestAnimationFrame(() => requestAnimationFrame(() => triggerPrint(kind)));
    });
  }

  const activeFormats = formats || (["excel", "csv", "pdf", "print"] as ExportFormatKey[]);
  const isLoading = loading !== null;

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            disabled={disabled || isLoading}
            title={disabled ? disabledReason : "Export data"}
            className={`no-print inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-[var(--accent,#4f46e5)]/40 hover:text-[var(--accent,#4f46e5)] disabled:cursor-not-allowed disabled:opacity-40 ${className || ""}`}
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            Export
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={6}
            className="no-print z-50 min-w-[190px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
          >
            {activeFormats.includes("excel") && (
              <DropdownMenu.Item
                onSelect={() => runOrAskConsent(doExcel)}
                className="flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-700 outline-none transition hover:bg-slate-50 focus:bg-slate-50"
              >
                <FORMAT_ITEMS.excel.icon className={`h-4 w-4 ${FORMAT_ITEMS.excel.iconColor}`} /> {FORMAT_ITEMS.excel.label}
              </DropdownMenu.Item>
            )}
            {activeFormats.includes("csv") && (
              <DropdownMenu.Item
                onSelect={() => runOrAskConsent(doCsv)}
                className="flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-700 outline-none transition hover:bg-slate-50 focus:bg-slate-50"
              >
                <FORMAT_ITEMS.csv.icon className={`h-4 w-4 ${FORMAT_ITEMS.csv.iconColor}`} /> {FORMAT_ITEMS.csv.label}
              </DropdownMenu.Item>
            )}
            {activeFormats.includes("pdf") && (
              <DropdownMenu.Item
                onSelect={() => runOrAskConsent(() => doPrintLike("pdf"))}
                className="flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-700 outline-none transition hover:bg-slate-50 focus:bg-slate-50"
              >
                <FORMAT_ITEMS.pdf.icon className={`h-4 w-4 ${FORMAT_ITEMS.pdf.iconColor}`} /> {FORMAT_ITEMS.pdf.label}
              </DropdownMenu.Item>
            )}
            {activeFormats.includes("print") && (
              <>
                <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />
                <DropdownMenu.Item
                  onSelect={() => runOrAskConsent(() => doPrintLike("print"))}
                  className="flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-700 outline-none transition hover:bg-slate-50 focus:bg-slate-50"
                >
                  <FORMAT_ITEMS.print.icon className={`h-4 w-4 ${FORMAT_ITEMS.print.iconColor}`} /> {FORMAT_ITEMS.print.label}
                </DropdownMenu.Item>
              </>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <Dialog open={consentOpen} onOpenChange={setConsentOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Before you export</DialogTitle></DialogHeader>
          <div className="space-y-3 text-sm text-slate-500">
            <p>
              Exported data is subject to the Australian Privacy Act 1988. Handle downloaded files securely — don&apos;t
              share them outside your practice, and delete them once you no longer need them.
            </p>
            <Button className="w-full" onClick={confirmConsent}>I understand — continue</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
