import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency } from '../utils/calculations'
import GoalModal from './GoalModal'
import './GoalsSection.css'

const GoalsSection = () => {
  const { financialGoals, deleteGoal } = useFinance()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [goalToEdit, setGoalToEdit] = useState(null)

  const handleEdit = (goal) => {
    setGoalToEdit(goal)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este objetivo?')) {
      deleteGoal(id)
    }
  }

  const handleAdd = () => {
    setGoalToEdit(null)
    setIsModalOpen(true)
  }

  return (
    <div className="budget-section financial-goals-section">
      <div className="section-header">
        <h2>Objetivos Financeiros</h2>
        <button className="btn btn-primary btn-sm" onClick={handleAdd}>
          + Criar objetivo
        </button>
      </div>

      <div className="goals-grid">
        {financialGoals.map(goal => {
          const percentage = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
          const isCompleted = goal.currentAmount >= goal.targetAmount
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount)

          return (
            <div key={goal.id} className={`goal-card ${isCompleted ? 'completed' : ''}`}>
              <div className="goal-header">
                <h3>{goal.name}</h3>
                <div className="goal-actions">
                  <button onClick={() => handleEdit(goal)} title="Editar">✏️</button>
                  <button onClick={() => handleDelete(goal.id)} title="Excluir">🗑️</button>
                </div>
              </div>
              
              <div className="goal-progress-container">
                <div className="goal-progress-bar">
                  <div 
                    className="goal-progress-fill" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="goal-percentage">{percentage.toFixed(0)}%</span>
              </div>
              
              <div className="goal-details">
                <div className="goal-values">
                  <span className="current">{formatCurrency(goal.currentAmount)}</span>
                  <span className="separator">/</span>
                  <span className="target">{formatCurrency(goal.targetAmount)}</span>
                </div>
                {!isCompleted && (
                  <div className="goal-remaining">
                    Faltam {formatCurrency(remaining)}
                  </div>
                )}
                {isCompleted && (
                  <div className="goal-status-badge">
                    Concluído! 🎉
                  </div>
                )}
              </div>
            </div>
          )
        })}
        
        {financialGoals.length === 0 && (
          <div className="empty-goals">
            <p>Nenhum objetivo definido ainda.</p>
            <button onClick={handleAdd}>Começar agora</button>
          </div>
        )}
      </div>

      <GoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        goalToEdit={goalToEdit}
      />
    </div>
  )
}

export default GoalsSection
