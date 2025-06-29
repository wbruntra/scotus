import { useState, useEffect } from 'react'
import AgreementMatrix from './components/AgreementMatrix'
import Dashboard from './components/Dashboard'
import CaseExplorer from './components/CaseExplorer'
import JusticeStats from './components/JusticeStats'
import scData from './data/scData.json'

const allJustices = [
  'Roberts',
  'Thomas',
  'Alito',
  'Sotomayor',
  'Kagan',
  'Gorsuch',
  'Kavanaugh',
  'Barrett',
  'Jackson',
]

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const tab = query.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [])

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    window.history.pushState(null, '', `?tab=${tab}`)
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">SCOTUS Data Visualization</h1>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabClick('dashboard')}
          >
            Dashboard
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'matrix' ? 'active' : ''}`}
            onClick={() => handleTabClick('matrix')}
          >
            Agreement Matrix
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'explorer' ? 'active' : ''}`}
            onClick={() => handleTabClick('explorer')}
          >
            Case Explorer
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => handleTabClick('stats')}
          >
            Justice Stats
          </button>
        </li>
      </ul>
      <div className="tab-content p-3 border border-top-0">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'matrix' && <AgreementMatrix />}
        {activeTab === 'explorer' && <CaseExplorer />}
        {activeTab === 'stats' && <JusticeStats />}
      </div>
    </div>
  )
}

export default App
