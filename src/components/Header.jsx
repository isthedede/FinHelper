import { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'
import './Header.css'

const Header = () => {
  const location = useLocation()
  const { userName, theme, toggleTheme, exportData, importData, resetAll } = useFinance()
  
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const fileInputRef = useRef(null)
  
  const handleExport = (format) => {
    exportData(format)
    setShowExportMenu(false)
  }
  
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const result = await importData(file)
      if (result.success) {
        alert('Dados importados com sucesso!')
      } else {
        alert(`Erro ao importar: ${result.error}`)
      }
      setShowImportModal(false)
    }
  }
  
  return (
    <header className="header">
      <nav className="header-nav">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          ORÇAMENTO DOMÉSTICO
        </Link>
        <Link 
          to="/goals" 
          className={`nav-link ${location.pathname === '/goals' ? 'active' : ''}`}
        >
          MINHAS METAS
        </Link>
        <Link 
          to="/evolution" 
          className={`nav-link ${location.pathname === '/evolution' ? 'active' : ''}`}
        >
          EVOLUÇÃO
        </Link>
      </nav>
      
      <div className="header-actions">
        {/* Reset All Button */}
        <button 
          className="icon-btn" 
          onClick={resetAll}
          title="Resetar Todos os Dados do Mês"
        >
          🗑️
        </button>
        
        {/* Theme Toggle */}
        <button 
          className="icon-btn" 
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        
        {/* Export Button */}
        <div className="dropdown">
          <button 
            className="icon-btn"
            onClick={() => setShowExportMenu(!showExportMenu)}
            title="Exportar Dados"
          >
            📥
          </button>
          
          {showExportMenu && (
            <div className="dropdown-menu">
              <button onClick={() => handleExport('pdf')}>
                📄 Exportar PDF
              </button>
              <button onClick={() => handleExport('excel')}>
                📊 Exportar Excel
              </button>
              <button onClick={() => handleExport('json')}>
                💾 Exportar JSON
              </button>
              <div className="dropdown-divider"></div>
              <button onClick={handleImportClick}>
                📤 Importar JSON
              </button>
            </div>
          )}
        </div>
        
        {/* User Profile */}
        <div className="user-profile">
          <span className="user-greeting">Olá, {userName || 'Usuário'}</span>
          <div className="user-avatar">{userName ? userName.charAt(0).toUpperCase() : 'U'}</div>
        </div>
      </div>
      
      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </header>
  )
}

export default Header
