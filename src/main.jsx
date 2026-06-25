import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '../Layout'
import Dashboard from '../Dashboard'
import Metas from '../Metas'
import Dicas from '../Dicas'
import Coach from '../Coach'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="metas" element={<Metas />} />
          <Route path="dicas" element={<Dicas />} />
          <Route path="coach" element={<Coach />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
