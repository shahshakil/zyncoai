// Single shared currency formatter — real billing is AUD only (Square
// charges "AUD" literally, invoices are Australian GST tax invoices). Every
// dashboard money() helper used to be a separate bare-`$` inline function;
// consolidated here so the currency is never ambiguous with a US-priced
// SaaS screenshot or support ticket.
export function formatAUD(cents: number): string {
  return `A$${((cents || 0) / 100).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
