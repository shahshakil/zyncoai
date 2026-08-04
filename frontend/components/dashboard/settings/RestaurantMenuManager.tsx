"use client";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Upload, Link as LinkIcon, Image as ImageIcon, FileText, ChefHat } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Select, Label, Textarea } from "@/components/dashboard/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";
import { ToggleRow } from "@/components/dashboard/ui/toggle";

interface Category { id: string; name: string; sortOrder: number }
interface ModifierOption { label: string; priceDeltaCents: number }
interface ModifierGroup { name: string; options: ModifierOption[] }
interface MenuItem {
  id: string; categoryId: string | null; name: string; description: string | null;
  priceCents: number; available: boolean; isSpecial: boolean; modifiers: ModifierGroup[] | null;
}
interface DraftItem {
  category: string | null; name: string; description: string | null; priceCents: number; modifiers: ModifierGroup[] | null;
}

const DAYS: { code: string; label: string }[] = [
  { code: "MON", label: "Mon" }, { code: "TUE", label: "Tue" }, { code: "WED", label: "Wed" },
  { code: "THU", label: "Thu" }, { code: "FRI", label: "Fri" }, { code: "SAT", label: "Sat" }, { code: "SUN", label: "Sun" },
];

const UNAVAILABLE_PLATFORMS = ["FoodHub", "POSApt", "Square for Restaurants", "Lightspeed", "OrderMate"];

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function RestaurantMenuManager() {
  const { data, mutate } = useApi<{ categories: Category[]; items: MenuItem[]; menuSource: { type: string; url?: string } | null }>("/api/business/restaurant-menu");
  const { data: peakData, mutate: mutatePeak } = useApi<{ peakHours: { day: string; start: string; end: string }[] }>("/api/business/orders/peak-hours");
  const { data: printerData, mutate: mutatePrinter } = useApi<{ epsonPrinterIp: string | null }>("/api/business/orders/printer-config");

  const [method, setMethod] = useState("manual");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [draft, setDraft] = useState<DraftItem[] | null>(null);
  const [draftSource, setDraftSource] = useState<"website" | "pdf" | "photo">("website");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [itemDialog, setItemDialog] = useState<{ item: MenuItem | null } | null>(null);
  const [peakHours, setPeakHours] = useState<{ day: string; start: string; end: string }[] | null>(null);
  const [printerIp, setPrinterIp] = useState<string | null>(null);

  const categories = data?.categories || [];
  const items = data?.items || [];
  const effectivePeakHours = peakHours ?? peakData?.peakHours ?? [];
  const effectivePrinterIp = printerIp ?? printerData?.epsonPrinterIp ?? "";

  async function extractFromWebsite() {
    if (!websiteUrl.trim()) return;
    setExtracting(true);
    try {
      const res = await apiPost<{ items: DraftItem[] }>("/api/business/restaurant-menu/import/website", { url: websiteUrl.trim() });
      // A zero-item result isn't a broken extraction — the AI reads
      // whatever static HTML the page actually sends, and plenty of real
      // restaurant sites (FoodHub, Wix, and similar ordering-platform
      // widgets) render their menu client-side via JavaScript, which never
      // appears in that HTML at all. Vertical-agnostic guidance to the
      // alternatives that don't have this limitation, rather than a silent
      // empty result — applies to any restaurant hitting this, not
      // specific to any one business's site.
      if (!res.items.length) {
        toast.error(
          "We couldn't find menu items on this website automatically - this usually happens when a site loads its menu dynamically (common with FoodHub, Wix, and similar platforms). Please try Manual entry, PDF menu upload, or Photo of menu instead.",
          { duration: 10000 }
        );
      }
      setDraft(res.items);
      setDraftSource("website");
    } catch (err: any) {
      toast.error(err?.message === "invalid_url" ? "Enter a valid website URL" : "Could not read that page");
    } finally {
      setExtracting(false);
    }
  }

  async function extractFromFile(file: File, kind: "pdf" | "photo") {
    setExtracting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/business/restaurant-menu/import/${kind}`, { method: "POST", body: formData, credentials: "include" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "extraction_failed");
      if (!json.items.length) toast.error(`No menu items found in that ${kind === "pdf" ? "PDF" : "photo"}`);
      setDraft(json.items);
      setDraftSource(kind);
    } catch {
      toast.error(`Could not read that ${kind === "pdf" ? "PDF" : "photo"}`);
    } finally {
      setExtracting(false);
    }
  }

  async function confirmDraft() {
    if (!draft || !draft.length) return;
    setSaving(true);
    try {
      await apiPost("/api/business/restaurant-menu/import/confirm", {
        items: draft,
        source: draftSource,
        ...(draftSource === "website" ? { url: websiteUrl.trim() } : {}),
      });
      toast.success(`Saved ${draft.length} menu item${draft.length === 1 ? "" : "s"}`);
      setDraft(null);
      mutate();
    } catch {
      toast.error("Could not save menu items");
    } finally {
      setSaving(false);
    }
  }

  async function addCategory() {
    if (!newCategoryName.trim()) return;
    try {
      await apiPost("/api/business/restaurant-menu/categories", { name: newCategoryName.trim() });
      toast.success("Category added");
      setNewCategoryName("");
      setCategoryDialogOpen(false);
      mutate();
    } catch {
      toast.error("Could not add category");
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete this category? Items in it will become uncategorised, not deleted.")) return;
    try {
      await apiPost(`/api/business/restaurant-menu/categories/${id}`, undefined, "DELETE");
      mutate();
    } catch {
      toast.error("Could not delete category");
    }
  }

  async function toggleItem(item: MenuItem, field: "available" | "isSpecial", value: boolean) {
    try {
      await apiPost(`/api/business/restaurant-menu/items/${item.id}`, { [field]: value }, "PATCH");
      mutate();
    } catch {
      toast.error("Could not update item");
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this menu item?")) return;
    try {
      await apiPost(`/api/business/restaurant-menu/items/${id}`, undefined, "DELETE");
      mutate();
    } catch {
      toast.error("Could not delete item");
    }
  }

  async function savePeakHours() {
    try {
      const res = await apiPost<{ peakHours: any[] }>("/api/business/orders/peak-hours", { peakHours: effectivePeakHours }, "PUT");
      setPeakHours(res.peakHours);
      toast.success("Peak times saved");
      mutatePeak();
    } catch {
      toast.error("Could not save peak times");
    }
  }

  async function savePrinterConfig() {
    try {
      await apiPost("/api/business/orders/printer-config", { epsonPrinterIp: effectivePrinterIp || null }, "PUT");
      toast.success("Printer settings saved");
      mutatePrinter();
    } catch {
      toast.error("Could not save printer settings");
    }
  }

  const itemsByCategory = new Map<string | null, MenuItem[]>();
  for (const item of items) {
    const key = item.categoryId;
    if (!itemsByCategory.has(key)) itemsByCategory.set(key, []);
    itemsByCategory.get(key)!.push(item);
  }
  const uncategorised = itemsByCategory.get(null) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Import Menu</CardTitle></CardHeader>
        <div className="space-y-3 p-4 pt-0">
          <div>
            <Label>Platform</Label>
            <Select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="manual">Manual entry</option>
              <option value="website">Own website (AI extract)</option>
              <option value="pdf">PDF menu upload (AI extract)</option>
              <option value="photo">Photo of menu (AI extract)</option>
              {UNAVAILABLE_PLATFORMS.map((p) => <option key={p} value={`unavailable:${p}`}>{p}</option>)}
            </Select>
          </div>

          {method.startsWith("unavailable:") && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
              {method.replace("unavailable:", "")} direct import isn&apos;t available yet - we&apos;re working on it. In
              the meantime, try &quot;Own website (AI extract)&quot;, &quot;PDF menu upload&quot;, or &quot;Photo of
              menu&quot; above to get your menu items in another way. Need something else?{" "}
              <a href="/contact" className="font-medium underline">Contact support</a>.
            </p>
          )}

          {method === "manual" && (
            <p className="text-xs text-slate-500">Add categories and items directly below.</p>
          )}

          {method === "website" && (
            <div className="flex gap-2">
              <Input placeholder="https://yourrestaurant.com/menu" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
              <Button onClick={extractFromWebsite} disabled={extracting || !websiteUrl.trim()}>
                <LinkIcon className="h-4 w-4" /> {extracting ? "Reading…" : "Extract"}
              </Button>
            </div>
          )}

          {(method === "pdf" || method === "photo") && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept={method === "pdf" ? "application/pdf" : "image/*"}
                className="hidden"
                onChange={(e) => e.target.files?.[0] && extractFromFile(e.target.files[0], method)}
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={extracting}>
                {method === "pdf" ? <FileText className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                {extracting ? "Reading…" : method === "pdf" ? "Upload PDF" : "Upload photo"}
              </Button>
            </div>
          )}

          {data?.menuSource?.type && (
            <p className="text-[11px] text-slate-400">
              Current menu source: {data.menuSource.type}{data.menuSource.type === "website" ? " — re-synced weekly" : ""}
            </p>
          )}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between p-4 pb-0">
          <CardTitle>Menu</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setCategoryDialogOpen(true)}><Plus className="h-3.5 w-3.5" /> Category</Button>
            <Button size="sm" onClick={() => setItemDialog({ item: null })}><Plus className="h-3.5 w-3.5" /> Item</Button>
          </div>
        </div>
        <div className="space-y-5 p-4">
          {categories.map((cat) => (
            <div key={cat.id}>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">{cat.name}</h3>
                <button onClick={() => deleteCategory(cat.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="space-y-2">
                {(itemsByCategory.get(cat.id) || []).map((item) => (
                  <ItemRow key={item.id} item={item} onEdit={() => setItemDialog({ item })} onToggle={toggleItem} onDelete={deleteItem} />
                ))}
                {!(itemsByCategory.get(cat.id) || []).length && <p className="text-xs text-slate-400">No items in this category yet.</p>}
              </div>
            </div>
          ))}
          {uncategorised.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-700">Uncategorised</h3>
              <div className="space-y-2">
                {uncategorised.map((item) => (
                  <ItemRow key={item.id} item={item} onEdit={() => setItemDialog({ item })} onToggle={toggleItem} onDelete={deleteItem} />
                ))}
              </div>
            </div>
          )}
          {!items.length && <p className="text-sm text-slate-400">No menu items yet — import a menu above or add one manually.</p>}
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>Peak Times</CardTitle></CardHeader>
        <div className="space-y-3 p-4 pt-0">
          <p className="text-xs text-slate-500">During these windows, Ella adds 10 minutes to every wait estimate she gives callers.</p>
          {effectivePeakHours.map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <Select value={w.day} onChange={(e) => setPeakHours(effectivePeakHours.map((x, j) => (j === i ? { ...x, day: e.target.value } : x)))} className="w-24">
                {DAYS.map((d) => <option key={d.code} value={d.code}>{d.label}</option>)}
              </Select>
              <Input type="time" value={w.start} onChange={(e) => setPeakHours(effectivePeakHours.map((x, j) => (j === i ? { ...x, start: e.target.value } : x)))} className="w-32" />
              <span className="text-xs text-slate-400">to</span>
              <Input type="time" value={w.end} onChange={(e) => setPeakHours(effectivePeakHours.map((x, j) => (j === i ? { ...x, end: e.target.value } : x)))} className="w-32" />
              <button onClick={() => setPeakHours(effectivePeakHours.filter((_, j) => j !== i))} className="text-slate-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setPeakHours([...effectivePeakHours, { day: "FRI", start: "18:00", end: "21:00" }])}>
              <Plus className="h-3.5 w-3.5" /> Add window
            </Button>
            <Button size="sm" onClick={savePeakHours}>Save</Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><ChefHat className="h-4 w-4" /> Kitchen Printer</CardTitle></CardHeader>
        <div className="space-y-3 p-4 pt-0">
          <p className="text-xs text-slate-500">
            Optional — if you have an Epson thermal printer on the same network as the kitchen tablet, enter its IP address for
            silent auto-printing. Leave blank to use the tablet&apos;s browser print dialog instead (works with any printer).
          </p>
          <div className="flex gap-2">
            <Input placeholder="e.g. 192.168.1.50" value={effectivePrinterIp} onChange={(e) => setPrinterIp(e.target.value)} className="max-w-xs" />
            <Button size="sm" variant="outline" onClick={savePrinterConfig}>Save</Button>
          </div>
        </div>
      </Card>

      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add Category</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="e.g. Burgers, Sides, Drinks" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
            <Button className="w-full" onClick={addCategory} disabled={!newCategoryName.trim()}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>

      {itemDialog && (
        <ItemFormDialog
          item={itemDialog.item}
          categories={categories}
          onClose={() => setItemDialog(null)}
          onSaved={() => { setItemDialog(null); mutate(); }}
        />
      )}

      {draft && (
        <Dialog open={!!draft} onOpenChange={(v) => !v && setDraft(null)}>
          <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
            <DialogHeader><DialogTitle>Review extracted menu ({draft.length} items)</DialogTitle></DialogHeader>
            <div className="space-y-2">
              {draft.map((item, i) => (
                <div key={i} className="rounded-lg border border-slate-200 p-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={item.name}
                      onChange={(e) => setDraft(draft.map((d, j) => (j === i ? { ...d, name: e.target.value } : d)))}
                      className="flex-1"
                    />
                    <Input
                      type="number" step="0.01"
                      value={(item.priceCents / 100).toFixed(2)}
                      onChange={(e) => setDraft(draft.map((d, j) => (j === i ? { ...d, priceCents: Math.round(Number(e.target.value) * 100) } : d)))}
                      className="w-24"
                    />
                    <button onClick={() => setDraft(draft.filter((_, j) => j !== i))} className="text-slate-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  {item.category && <p className="mt-1 text-[11px] text-slate-400">{item.category}</p>}
                </div>
              ))}
              <Button className="w-full" onClick={confirmDraft} disabled={saving || !draft.length}>
                <Upload className="h-4 w-4" /> {saving ? "Saving…" : `Save ${draft.length} items to menu`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ItemRow({ item, onEdit, onToggle, onDelete }: {
  item: MenuItem;
  onEdit: () => void;
  onToggle: (item: MenuItem, field: "available" | "isSpecial", value: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
      <div className="min-w-0 flex-1 cursor-pointer" onClick={onEdit}>
        <p className="text-sm font-medium text-slate-800">
          {item.name} {item.isSpecial && <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">SPECIAL</span>}
        </p>
        {item.description && <p className="truncate text-xs text-slate-400">{item.description}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <span className="text-sm font-semibold text-slate-700">{money(item.priceCents)}</span>
        <button
          onClick={() => onToggle(item, "available", !item.available)}
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${item.available ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}
        >
          {item.available ? "Available" : "Sold out"}
        </button>
        <button onClick={() => onDelete(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

function ItemFormDialog({ item, categories, onClose, onSaved }: {
  item: MenuItem | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [price, setPrice] = useState(item ? (item.priceCents / 100).toFixed(2) : "");
  const [categoryId, setCategoryId] = useState(item?.categoryId || "");
  const [isSpecial, setIsSpecial] = useState(item?.isSpecial || false);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!name.trim() || !price) return;
    setSaving(true);
    try {
      const body = { name: name.trim(), description: description.trim() || null, priceCents: Math.round(Number(price) * 100), categoryId: categoryId || null, isSpecial };
      if (item) await apiPost(`/api/business/restaurant-menu/items/${item.id}`, body, "PATCH");
      else await apiPost("/api/business/restaurant-menu/items", body, "POST");
      toast.success(item ? "Item updated" : "Item added");
      onSaved();
    } catch {
      toast.error("Could not save item");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{item ? "Edit Item" : "Add Item"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div className="flex gap-2">
            <div className="flex-1"><Label>Price ($)</Label><Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
            <div className="flex-1">
              <Label>Category</Label>
              <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">None</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </div>
          </div>
          <ToggleRow label="Daily special" checked={isSpecial} onChange={setIsSpecial} />
          <Button className="w-full" onClick={save} disabled={saving || !name.trim() || !price}>{saving ? "Saving…" : "Save"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
