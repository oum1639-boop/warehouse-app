import React from 'react'
import ProductsTable from './components/ProductsTable'

export default function App() {
  return (
    <div style={{ padding: 16, fontFamily: 'system-ui, Arial' }}>
      <h2>📦 Warehouse (Supabase)</h2>
      <p style={{color:'#666'}}>เพิ่มสินค้า, โยก RAW→WIP และ WIP→FIN แบบ realtime ผ่านฐานข้อมูล Supabase</p>
      <ProductsTable />
    </div>
  )
}
