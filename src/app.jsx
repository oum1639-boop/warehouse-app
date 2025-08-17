import React, { useEffect, useState } from 'react'
import { supabase, ok } from './supabase'

export default function App(){
  const [status, setStatus] = useState('กำลังตรวจสอบการเชื่อมต่อ...')
  const [items, setItems] = useState([])

  useEffect(()=>{
    (async ()=>{
      if(!ok){ setStatus('ยังไม่ได้ตั้งค่า ENV บน Vercel: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY'); return }
      try{
        const { data, error } = await supabase.from('items').select('*').limit(5)
        if(error) setStatus('เชื่อมต่อได้ แต่อ่านตารางไม่สำเร็จ: ' + error.message)
        else { setStatus('เชื่อมต่อ Supabase สำเร็จ ✅'); setItems(data||[]) }
      }catch(e){ setStatus('เชื่อมต่อไม่สำเร็จ: ' + String(e)) }
    })()
  }, [])

  return (
    <div className="card">
      <h2>📦 Warehouse (Vercel + Supabase)</h2>
      <p>{status}</p>

      {items.length>0 && (
        <>
          <h3>ตัวอย่างข้อมูลจากตาราง <code>items</code> (5 แถว)</h3>
          <div style={{overflowX:'auto'}}>
            <table>
              <thead><tr><th>name</th><th>sku</th><th>raw</th><th>wip</th><th>fin</th></tr></thead>
              <tbody>
                {items.map(r=> (
                  <tr key={r.id}>
                    <td>{r.name}</td><td>{r.sku}</td><td>{r.rawQty}</td><td>{r.wipQty}</td><td>{r.finishedQty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
