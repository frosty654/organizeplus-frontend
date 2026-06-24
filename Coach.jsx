import { createContext, useContext, useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Metas from "./pages/Metas"
import Dicas from "./pages/Dicas"
import Coach from "./pages/Coach"
import Layout from "./components/Layout"

const API = import.meta.env.VITE_API_URL || "http://localhost:8000"
export const AuthCtx = createContext(null)

export function useAuth() { return useContext(AuthCtx) }
export { API }

function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) { setLoading(false); return }
    fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(u => { setUser(u); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token])

  const login = async (name, email) => {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    })
    const data = await res.json()
    localStorage.setItem("token", data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const logout = async () => {
    await fetch(`${API}/api/auth/logout`, {
      method: "POST", headers: { Authorization: `Bearer ${token}` }
    })
    localStorage.removeItem("token")
    setToken(null); setUser(null)
  }

  if (loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",color:"#2C5545",fontFamily:"Outfit,sans-serif"}}>Carregando...</div>

  return (
    <AuthCtx.Provider value={{ user, token, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
            <Route index element={<Dashboard />} />
            <Route path="metas" element={<Metas />} />
            <Route path="dicas" element={<Dicas />} />
            <Route path="coach" element={<Coach />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthCtx.Provider>
  )
}

export default App
