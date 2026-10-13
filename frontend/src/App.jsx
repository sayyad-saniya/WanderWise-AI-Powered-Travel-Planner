import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import CreateTripPage from './pages/CreateTripPage.jsx'
import TripViewPage from './pages/TripViewPage.jsx'

export default function App() {
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<CreateTripPage />} />
          <Route path="/trip/:token" element={<TripViewPage />} />
        </Routes>
      </main>
    </div>
  )
}
