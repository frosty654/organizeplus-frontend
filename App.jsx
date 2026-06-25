import { Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Dashboard from './Dashboard'
import Metas from './Metas'
import Dicas from './Dicas'
import Coach from './Coach'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="metas" element={<Metas />} />
        <Route path="dicas" element={<Dicas />} />
        <Route path="coach" element={<Coach />} />
      </Route>
    </Routes>
  )
}
