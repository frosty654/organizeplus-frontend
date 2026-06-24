import { useState, useEffect } from "react"
import { useAuth, API } from "../App"

const CATS = ["💰 Reserva de emergência", "📚 Educação financeira", "🏠 Casa própria", "🚗 Transporte", "💪 Saúde", "🎯 Outro"]

export default function Metas() {
  const { token } = useAuth()
  const [goals, setGoals] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ title: "", valor: "", categoria: CATS[0] })

  const load = () => fetch(`${API}/api/goals`, { headers: { Authorization: `Bearer ${token}` } })
    .then(r => r.json()).then(setGoals).catch(() => {})

  useEffect(() => { load() }, [])

  const create = async () => {
    if (!form.title) return
    await fetch(`${API}/api/goals`, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: form.title, valor: parseFloat(form.valor) || 0, categoria: form.categoria, progress: 0 })
    })
    setModal(false); setForm({ title: "", valor: "", categoria: CATS[0] }); load()
  }

  const update = async (id, progress) => {
    await fetch(`${API}/api/goals/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ progress: Math.min(100, progress) })
    }); load()
  }

  const del = async (id) => {
    await fetch(`${API}/api/goals/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }); load()
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1a2e26" }}>Minhas Metas</h2>
          <p style={{ fontSize: 13, color: "#5a7a6e" }}>Acompanhe seu progresso</p>
        </div>
        <button onClick={() => setModal(true)}
          style={{ background: "#C86A53", color: "#fff", border: "none", borderRadius: 50, width: 42, height: 42, fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
      </div>

      {goals.length === 0 && <p style={{ textAlign: "center", color: "#5a7a6e", marginTop: 60, fontSize: 14 }}>Nenhuma meta ainda.<br/>Toque em + para criar sua primeira!</p>}

      {goals.map(g => (
        <div key={g.id} style={{ background: "#fff", border: "0.5px solid rgba(44,85,69,0.15)", borderRadius: 12, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#1a2e26" }}>{g.title}</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: g.progress >= 100 ? "#e8f5e9" : "#e8f0ec", color: g.progress >= 100 ? "#2e7d32" : "#2C5545" }}>
              {g.progress >= 100 ? "✓ Concluída" : "Ativa"}
            </span>
          </div>
          <div style={{ background: "#e8f0ec", borderRadius: 4, height: 6, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ background: "#2C5545", height: "100%", width: `${g.progress}%`, borderRadius: 4, transition: "width 0.3s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#5a7a6e", marginBottom: g.progress < 100 ? 10 : 0 }}>
            <span>{g.categoria}</span>
            <span>{g.progress}% — R${Math.round(g.valor * g.progress / 100)} / R${g.valor}</span>
          </div>
          {g.progress < 100 && (
            <div style={{ display: "flex", gap: 8 }}>
              {[10, 25, 50].map(pct => (
                <button key={pct} onClick={() => update(g.id, g.progress + pct)}
                  style={{ flex: 1, padding: "7px 0", border: "0.5px solid rgba(44,85,69,0.2)", borderRadius: 8, background: "#fff", fontSize: 12, cursor: "pointer", color: "#2C5545" }}>+{pct}%</button>
              ))}
              <button onClick={() => del(g.id)}
                style={{ padding: "7px 10px", border: "0.5px solid #ffd0c8", borderRadius: 8, background: "#fff", fontSize: 12, cursor: "pointer", color: "#C86A53" }}>🗑</button>
            </div>
          )}
        </div>
      ))}

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "flex-end", zIndex: 50 }} onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div style={{ background: "#FAF9F6", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 480, margin: "0 auto" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1a2e26", marginBottom: 16 }}>Nova Meta</h3>
            {[
              ["Título da meta", "text", "meta-titulo", "Ex: Juntar R$500 de reserva", "title"],
              ["Valor total (R$)", "number", "meta-valor", "500", "valor"],
            ].map(([lbl, type, , ph, key]) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: "#5a7a6e", display: "block", marginBottom: 4 }}>{lbl}</label>
                <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph}
                  style={{ width: "100%", padding: "10px 12px", border: "0.5px solid rgba(44,85,69,0.2)", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "#5a7a6e", display: "block", marginBottom: 4 }}>Categoria</label>
              <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", border: "0.5px solid rgba(44,85,69,0.2)", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none" }}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={create} style={{ width: "100%", background: "#2C5545", color: "#fff", border: "none", borderRadius: 10, padding: 13, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Criar meta</button>
            <button onClick={() => setModal(false)} style={{ width: "100%", background: "transparent", border: "none", padding: 10, fontSize: 13, color: "#5a7a6e", cursor: "pointer", marginTop: 6, fontFamily: "inherit" }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
