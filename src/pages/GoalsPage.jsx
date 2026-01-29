import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'
import { redistributeGoals } from '../utils/calculations'
import Header from '../components/Header'
import DonutChart from '../components/DonutChart'
import './GoalsPage.css'

const GoalsPage = () => {
  const navigate = useNavigate()
  const { categoriesGoals, updateCategoryGoal, resetGoals } = useFinance()
  
  const [localGoals, setLocalGoals] = useState(categoriesGoals)
  const [showResetModal, setShowResetModal] = useState(false)
  
  const handleSliderChange = (index, newValue) => {
    const updated = redistributeGoals(localGoals, index, parseInt(newValue))
    setLocalGoals(updated)
  }
  
  const handleResetClick = () => {
    setShowResetModal(true)
  }
  
  const handleResetConfirm = () => {
    resetGoals()
    // Update local state immediately from context
    setLocalGoals(categoriesGoals)
    setShowResetModal(false)
    // Small timeout to ensure context is updated
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }
  
  const handleResetCancel = () => {
    setShowResetModal(false)
  }
  
  const handleSave = () => {
    // Update all categories in context
    localGoals.forEach(cat => {
      updateCategoryGoal(cat.id, cat.percentage)
    })
    
    // Navigate back to budget page
    navigate('/')
  }
  
  const totalPercentage = localGoals.reduce((sum, cat) => sum + cat.percentage, 0)
  
  return (
    <div className="page goals-page">
      <Header />
      
      <main className="page-content">
        <div className="goals-header">
          <div>
            <h1>Metas</h1>
            <p className="subtitle">Edite os itens abaixo para ajustar suas metas.</p>
          </div>
        </div>
        
        <div className="goals-layout">
          {/* Coluna Esquerda: Gráfico */}
          <div className="goals-section chart-section">
            <div className="chart-header">
              <h3>Total: {totalPercentage}%</h3>
              {totalPercentage !== 100 && (
                <p className="warning-text">⚠️ A soma deve ser 100%</p>
              )}
            </div>
            
            <DonutChart categories={localGoals} />
            
            <div className="chart-legend">
              {localGoals.map(cat => (
                <div key={cat.id} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: cat.color }} />
                  <span className="legend-name">{cat.name}</span>
                  <span className="legend-percentage">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Coluna Direita: Sliders */}
          <div className="goals-section sliders-section">
            <div className="sliders-list">
              {localGoals.map((cat, index) => (
                <div key={cat.id} className="slider-item">
                  <div className="slider-header">
                    <label htmlFor={`slider-${cat.id}`}>{cat.name}</label>
                    <span className="slider-value">{cat.percentage}%</span>
                  </div>
                  
                  <div className="slider-container">
                    <div 
                      className="slider-track"
                      style={{
                        background: `linear-gradient(to right, ${cat.color} 0%, ${cat.color} ${cat.percentage}%, var(--bg-tertiary) ${cat.percentage}%, var(--bg-tertiary) 100%)`
                      }}
                    />
                    <input
                      type="range"
                      id={`slider-${cat.id}`}
                      min="0"
                      max="100"
                      value={cat.percentage}
                      onChange={(e) => handleSliderChange(index, e.target.value)}
                      className="slider"
                      style={{
                        '--thumb-color': cat.color
                      }}
                    />
                  </div>
                  
                  <div className="slider-labels">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="goals-actions">
              <button className="btn btn-secondary" onClick={handleResetClick}>
                Resetar valores
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSave}
                disabled={totalPercentage !== 100}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
        
        {/* Reset Confirmation Modal */}
        {showResetModal && (
          <div className="modal-overlay" onClick={handleResetCancel}>
            <div className="modal-content reset-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>⚠️ Resetar Metas</h2>
              </div>
              
              <div className="modal-body">
                <p className="modal-text">
                  Tem certeza que deseja resetar as metas para os <strong>valores recomendados</strong>?
                </p>
                
                <div className="recommended-values">
                  <div className="value-item">
                    <span className="value-dot" style={{ backgroundColor: '#4a90e2' }} />
                    <span className="value-label">Custos fixos:</span>
                    <span className="value-percent">35%</span>
                  </div>
                  <div className="value-item">
                    <span className="value-dot" style={{ backgroundColor: '#00d4aa' }} />
                    <span className="value-label">Conforto:</span>
                    <span className="value-percent">15%</span>
                  </div>
                  <div className="value-item">
                    <span className="value-dot" style={{ backgroundColor: '#f5d547' }} />
                    <span className="value-label">Metas:</span>
                    <span className="value-percent">10%</span>
                  </div>
                  <div className="value-item">
                    <span className="value-dot" style={{ backgroundColor: '#d946ef' }} />
                    <span className="value-label">Prazeres:</span>
                    <span className="value-percent">10%</span>
                  </div>
                  <div className="value-item">
                    <span className="value-dot" style={{ backgroundColor: '#60a5fa' }} />
                    <span className="value-label">Liberdade financeira:</span>
                    <span className="value-percent">25%</span>
                  </div>
                  <div className="value-item">
                    <span className="value-dot" style={{ backgroundColor: '#fb923c' }} />
                    <span className="value-label">Conhecimento:</span>
                    <span className="value-percent">5%</span>
                  </div>
                </div>
                
                <p className="modal-warning">
                  Esta ação irá substituir suas configurações atuais.
                </p>
              </div>
              
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={handleResetCancel}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={handleResetConfirm}>
                  Sim, Resetar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default GoalsPage
