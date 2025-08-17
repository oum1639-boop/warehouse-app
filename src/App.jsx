// src/App.jsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase.from("items").select("*").order("updatedAt", { ascending: false });
    if (error) console.error("Error fetching items:", error.message);
    setItems(data || []);
    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "system-ui, Arial" }}>
      <h1>📦 Warehouse App</h1>
      <h3>รายการสินค้า</h3>
      {loading ? (
        <div>กำลังโหลด...</div>
      ) : items.length === 0 ? (
        <div>ยังไม่มีข้อมูล</div>
      ) : (
        <ul>
          {items.map((it) => (
            <li key={it.id}>
              <b>{it.name}</b> ({it.sku}) — RAW: {it.rawQty} | WIP: {it.wipQty} | FIN: {it.finishedQty}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
