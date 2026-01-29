import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import './ExpenseModal.css'

const ExpenseModal = ({ isOpen, onClose, expenseToEdit = null }) => {
  const { categoriesGoals, addExpense, updateExpense } = useFinance()
  
  const [formData, setFormData] = useState({
    categoryId: expenseToEdit?.categoryId || categoriesGoals[0]?.id || '',
    amount: expenseToEdit?.amount || '',
    description: expenseToEdit?.description || '',
    date: expenseToEdit?.date ? expenseToEdit.date.split('T')[0] : new Date().toISOString().split('T')[0]
  })
  
  const [errors, setErrors] = useState({})
  
  if (!isOpen) return null
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero'
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Selecione uma categoria'
    }
    
    return newErrors
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    const amount = parseFloat(formData.amount)
    
    if (expenseToEdit) {
      updateExpense(expenseToEdit.id, {
        ...formData,
        amount
      })
    } else {
      addExpense(
        formData.categoryId,
        amount,
        formData.description,
        new Date(formData.date).toISOString()
      )
    }
    
    onClose()
  }
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
  
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content expense-modal">
        <div className="modal-header">
          <h2>{expenseToEdit ? 'Editar Gasto' : 'Novo Gasto'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="categoryId">Categoria *</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={errors.categoryId ? 'error' : ''}
            >
              {categoriesGoals.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <span className="error-message">{errors.categoryId}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="amount">Valor (R$) *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={errors.amount ? 'error' : ''}
            />
            {errors.amount && <span className="error-message">{errors.amount}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Descrição (opcional)</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ex: Conta de luz"
              maxLength="100"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Data *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {expenseToEdit ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExpenseModal
