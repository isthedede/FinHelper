import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import './GoalModal.css'

const GoalModal = ({ isOpen, onClose, goalToEdit = null }) => {
  const { addGoal, updateGoal } = useFinance()
  
  const [formData, setFormData] = useState({
    name: goalToEdit ? goalToEdit.name : '',
    targetAmount: goalToEdit ? goalToEdit.targetAmount : '',
    currentAmount: goalToEdit ? goalToEdit.currentAmount : ''
  })
  
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!formData.name) {
      setError('Nome é obrigatório')
      return
    }
    
    if (Number(formData.targetAmount) <= 0) {
      setError('Valor alvo deve ser maior que zero')
      return
    }

    if (Number(formData.currentAmount) < 0) {
      setError('Valor atual não pode ser negativo')
      return
    }

    const goalData = {
      name: formData.name,
      targetAmount: Number(formData.targetAmount),
      currentAmount: Number(formData.currentAmount || 0)
    }

    if (goalToEdit) {
      const result = updateGoal(goalToEdit.id, goalData)
      if (!result.success) {
        setError(result.error || 'Erro ao atualizar')
        return
      }
    } else {
      const result = addGoal(goalData)
      if (!result.success) {
        setError(result.error || 'Erro ao criar')
        return
      }
    }
    
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content goal-modal">
        <div className="modal-header">
          <h2>{goalToEdit ? 'Editar Objetivo' : 'Novo Objetivo'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label>Nome do Objetivo</label>
            <input 
              type="text" 
              placeholder="Ex: Viagem para Europa"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Valor Alvo (R$)</label>
            <input 
              type="number" 
              placeholder="0.00"
              value={formData.targetAmount}
              onChange={e => setFormData({...formData, targetAmount: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Valor Atual (Guardado) (R$)</label>
            <input 
              type="number" 
              placeholder="0.00"
              value={formData.currentAmount}
              onChange={e => setFormData({...formData, currentAmount: e.target.value})}
            />
          </div>
          
          {error && <p className="error-msg">{error}</p>}
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit}>
            {goalToEdit ? 'Salvar Alterações' : 'Criar Objetivo'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GoalModal
