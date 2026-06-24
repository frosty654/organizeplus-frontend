import { Outlet, NavLink } from "react-router-dom"
import { useAuth } from "../App"

const nav = [
  { to: "/", icon: "🏠", label: "Início", end: true },
  { to: "/metas", icon: "🎯", label: "Metas" },
  { to: "/dicas", icon: "💡", label: "Dicas" },
  { to: "/coach", icon: "🤖", label: "Coach IA" },
]

export default function Layout() {
  const { user, logout } = useAuth()
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#FAF9F6", fontFamily: "Outfit, sans-serif" }}>
      <header style={{ background: "#2C5545", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#fff", fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 20 }}>
          Organize<span style={{ color: "#a8d4bc" }}>+</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#a8d4bc", fontSize: 13 }}>{user?.name}</span>
          <button onClick={logout} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 20, padding: "4px 12px", color: "#fff", fontSize: 12, cursor: "pointer" }}>Sair</button>
        </div>
      </header>
      <main style={{ flex: 1, padding: "20px 16px 80px", maxWidth: 480, margin: "0 auto", width: "100%" }}>
        <Outlet />
      </main>
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "0.5px solid rgba(44,85,69,0.15)", display: "flex", maxWidth: 480, margin: "0 auto" }}>
        {nav.map(n => (
          <NavLink key={n.to} to={n.to} end={n.end}
            style={({ isActive }) => ({
              flex: 1, padding: "10px 4px 6px", display: "flex", flexDirection: "column", alignItems: "center",
              gap: 3, fontSize: 10, textDecoration: "none",
              color: isActive ? "#2C5545" : "#5a7a6e", fontWeight: isActive ? 500 : 400
            })}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
