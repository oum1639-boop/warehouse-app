import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

// helper แปลงค่าตัวเลข
const num = (v, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ฟอร์มเพิ่มสินค้า
  const [form, setForm] = useState({
    sku: "",
    name: "",
    unit: "kg",
    rawQty: "",
    wipQty: "",
    finishedQty: "",
    location: "",
    unitCost: "",
  });

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    setErr("");
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("updatedAt", { ascending: false })
      .limit(100);
    if (error) setErr(error.message);
    setItems(data || []);
    setLoading(false);
  }

  async function addItem(e) {
    e.preventDefault();
    setErr("");

    // validate เบื้องต้น
    if (!form.sku.trim() || !form.name.trim()) {
      setErr("กรุณากรอก SKU และชื่อสินค้า");
      return;
    }

    const payload = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      unit: form.unit || null,
      rawQty: num(form.rawQty),
      wipQty: num(form.wipQty),
      finishedQty: num(form.finishedQty),
      location: form.location.trim() || null,
      unitCost: num(form.unitCost),
    };

    const { error } = await supabase.from("items").insert([payload]);
    if (error) {
      setErr(error.message);
      return;
    }
    // เคลียร์ฟอร์ม & โหลดใหม่
    setForm({
      sku: "",
      name: "",
      unit: "kg",
      rawQty: "",
      wipQty: "",
      finishedQty: "",
      location: "",
      unitCost: "",
    });
    await loadItems();
  }

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, Arial" }}>
      <h1>📦 Warehouse App</h1>
      <p style={{ color: "#666", marginTop: -6 }}>Vercel + Supabase</p>

      {/* ฟอร์มเพิ่มสินค้า */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 12,
          marginBottom: 16,
          background: "#fff",
          maxWidth: 900,
        }}
      >
        <h3 style={{ marginTop: 0 }}>เพิ่มสินค้าใหม่</h3>
        {err && (
          <div
            style={{
              background: "#ffe8e8",
              border: "1px solid #ffb3b3",
              padding: "8px 12px",
              borderRadius: 8,
              marginBottom: 10,
              color: "#a40000",
            }}
          >
            {err}
          </div>
        )}
        <form onSubmit={addItem} style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <input
              placeholder="SKU *"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              style={inp}
            />
            <input
              placeholder="ชื่อสินค้า *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inp}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              style={inp}
            >
              <option value="kg">kg</option>
              <option value="unit">unit</option>
            </select>
            <input
              type="text"
              placeholder="ที่เก็บ (location)"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              style={inp}
            />
            <input
              type="number"
              step="0.001"
              placeholder="ต้นทุน/หน่วย (unitCost)"
              value={form.unitCost}
              onChange={(e) => setForm({ ...form, unitCost: e.target.value })}
              style={inp}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <input
              type="number"
              step="0.001"
              placeholder="RAW"
              value={form.rawQty}
              onChange={(e) => setForm({ ...form, rawQty: e.target.value })}
              style={inp}
            />
            <input
              type="number"
              step="0.001"
              placeholder="WIP"
              value={form.wipQty}
              onChange={(e) => setForm({ ...form, wipQty: e.target.value })}
              style={inp}
            />
            <input
              type="number"
              step="0.001"
              placeholder="Finished"
              value={form.finishedQty}
              onChange={(e) => setForm({ ...form, finishedQty: e.target.value })}
              style={inp}
            />
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <button type="submit" style={btn}>
              + เพิ่มสินค้า
            </button>
            <button type="button" onClick={loadItems} style={{ ...btn, background: "#eee" }}>
              รีเฟรช
            </button>
          </div>
        </form>
      </div>

      {/* ตารางสินค้า */}
      <div style={{ overflowX: "auto", maxWidth: 900 }}>
        {loading ? (
          <div>กำลังโหลดข้อมูล...</div>
        ) : (
          <table style={{ borderCollapse: "collapse", width: "100%", background: "#fff" }}>
            <thead>
              <tr>
                {["ชื่อ", "SKU", "RAW", "WIP", "Finished", "หน่วย", "ที่เก็บ"].map((h) => (
                  <th key={h} style={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td style={td}>{it.name}</td>
                  <td style={td}>{it.sku}</td>
                  <td style={td}>{it.rawQty}</td>
                  <td style={td}>{it.wipQty}</td>
                  <td style={td}>{it.finishedQty}</td>
                  <td style={td}>{it.unit || "-"}</td>
                  <td style={td}>{it.location || "-"}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td style={td} colSpan={7}>
                    ยังไม่มีข้อมูลในตาราง <code>items</code>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const inp = {
  padding: "10px",
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
};

const btn = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #ddd",
  background: "#f3f3f3",
  cursor: "pointer",
};

const th = {
  textAlign: "left",
  border: "1px solid #eee",
  padding: "8px",
  background: "#f7f7f7",
};

const td = {
  border: "1px solid #eee",
  padding: "8px",
};
