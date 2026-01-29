import { useState, useEffect } from 'react'
import './DebtModal.css'

const DebtModal = ({ isOpen, onClose, onSave, debt }) => {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [isPaid, setIsPaid] = useState(false)
  
  // Reset form when modal opens/closes or debt changes
  useEffect(() => {
    if (isOpen) {
      if (debt) {
        // Editing existing debt
        setName(debt.name || '')
        setAmount(debt.amount?.toString() || '')
        setDueDate(debt.dueDate ? debt.dueDate.split('T')[0] : '')
        setIsPaid(debt.isPaid || false)
      } else {
        // Adding new debt
        setName('')
        setAmount('')
        setDueDate(new Date().toISOString().split('T')[0])
        setIsPaid(false)
      }
    }
  }, [isOpen, debt])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const amountNum = parseFloat(amount)
    
    if (!name.trim() || isNaN(amountNum) || amountNum <= 0) {
      alert('Por favor, preencha todos os campos corretamente')
      return
    }
    
    onSave({
      name: name.trim(),
      amount: amountNum,
      dueDate: new Date(dueDate).toISOString(),
      isPaid
    })
    
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content debt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{debt ? 'Editar Dívida' : 'Adicionar Dívida'}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="debt-name">Nome da Dívida *</label>
              <input
                type="text"
                id="debt-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Cartão de Crédito, Conta Atrasada..."
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="debt-amount">Valor (R$) *</label>
              <input
                type="number"
                id="debt-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                step="0.01"
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="debt-dueDate">Data de Vencimento *</label>
              <input
                type="date"
                id="debt-dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={isPaid}
                  onChange={(e) => setIsPaid(e.target.checked)}
                />
                <span>Marcar como pago</span>
              </label>
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {debt ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DebtModal
