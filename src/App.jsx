import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { FinanceProvider, useFinance } from './context/FinanceContext'
import BudgetPage from './pages/BudgetPage'
import GoalsPage from './pages/GoalsPage'
import EvolutionPage from './pages/EvolutionPage'
import WelcomeModal from './components/WelcomeModal'

function AppContent() {
  const { userName } = useFinance()
  const [showWelcome, setShowWelcome] = useState(!userName)
  
  return (
    <>
      <Router basename="/FinHelper">
        <Routes>
          <Route path="/" element={<BudgetPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/evolution" element={<EvolutionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      
      <WelcomeModal 
        isOpen={showWelcome && !userName} 
        onClose={() => setShowWelcome(false)} 
      />
    </>
  )
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  )
}

export default App
