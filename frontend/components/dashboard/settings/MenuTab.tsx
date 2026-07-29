"use client";
// Menu & Pricing (RESTAURANT/SALON) — a simple price list, not a POS/stock
// system. Backed by Business.settings.menu (business/menu.ts).
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalOps } from "@/lib/verticalOps";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input, Label } from "../ui/input";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "../ui/table";

interface MenuItem { id: string; name: string; priceCents: number; category: string | null }

export function MenuTab() {
  const { business } = useDashboard();
  const ops = getVerticalOps(business.vertical);
  const { data, mutate } = useApi<{ ok: boolean; items: MenuItem[] }>("/api/business/menu");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => { if (data?.items) setItems(data.items); }, [data]);

  async function save(next: MenuItem[]) {
    setSaving(true);
    try {
      const res = await apiPost<{ ok: boolean; items: MenuItem[] }>("/api/business/menu", { items: next }, "PUT");
      setItems(res.items);
      mutate();
    } catch {
      toast.error("Could not save menu");
    } finally {
      setSaving(false);
    }
  }

  function addItem() {
    const priceCents = Math.round(parseFloat(price || "0") * 100);
    if (!name.trim() || !priceCents) { toast.error("Enter a name and price"); return; }
    const next = [...items, { id: crypto.randomUUID(), name: name.trim(), priceCents, category: category.trim() || null }];
    save(next);
    setName(""); setPrice(""); setCategory("");
  }

  function removeItem(id: string) {
    save(items.filter((i) => i.id !== id));
  }

  return (
    <Card>
      <CardHeader><CardTitle>{ops?.menuLabel || "Menu & Pricing"}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex-1 min-w-[160px]"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Full haircut" /></div>
          <div className="w-32"><Label>Price ($)</Label><Input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
          <div className="w-40"><Label>Category</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Optional" /></div>
          <Button size="sm" onClick={addItem} disabled={saving}><Plus className="h-4 w-4" /> Add</Button>
        </div>
        <Table>
          <Thead><tr><Th>Name</Th><Th>Category</Th><Th>Price</Th><Th></Th></tr></Thead>
          <Tbody>
            {items.map((i) => (
              <Tr key={i.id}>
                <Td className="font-medium text-slate-700">{i.name}</Td>
                <Td>{i.category || "—"}</Td>
                <Td>${(i.priceCents / 100).toFixed(2)}</Td>
                <Td><button title="Remove" onClick={() => removeItem(i.id)} className="text-slate-400 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {!items.length && <EmptyState title="No items yet" description="Add your menu or service list above." />}
      </CardContent>
    </Card>
  );
}
