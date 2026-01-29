import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import './WelcomeModal.css'

const WelcomeModal = ({ isOpen, onClose }) => {
  const { setUserName } = useFinance()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  
  if (!isOpen) return null
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('Por favor, digite seu nome')
      return
    }
    
    if (name.trim().length < 2) {
      setError('Nome deve ter pelo menos 2 caracteres')
      return
    }
    
    setUserName(name.trim())
    onClose()
  }
  
  return (
    <div className="modal-overlay welcome-modal-overlay">
      <div className="modal-content welcome-modal-content">
        <div className="welcome-header">
          <h1 className="welcome-title">👋 Bem-vindo ao FinHelper!</h1>
          <p className="welcome-subtitle">
            Sua jornada para organizar as finanças começa agora.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="welcome-form">
          <div className="form-group">
            <label htmlFor="userName">Como podemos te chamar?</label>
            <input
              type="text"
              id="userName"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              placeholder="Digite seu nome"
              autoFocus
              className={error ? 'error' : ''}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          
          <button type="submit" className="btn btn-primary btn-large">
            Começar
          </button>
        </form>
        
        <div className="welcome-features">
          <p className="features-title">O que você pode fazer:</p>
          <ul>
            <li>📊 Controlar gastos e orçamento mensal</li>
            <li>🎯 Definir metas financeiras personalizadas</li>
            <li>📈 Visualizar relatórios e estatísticas</li>
            <li>💾 Exportar dados em PDF, Excel ou JSON</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WelcomeModal
