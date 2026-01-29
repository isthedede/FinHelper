import { useState, useEffect } from 'react'
import './InvestmentModal.css'

const InvestmentModal = ({ isOpen, onClose, onSave, investment = null }) => {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  
  useEffect(() => {
    if (investment) {
      setName(investment.name || '')
      setAmount(investment.amount ? investment.amount.toString() : '')
    } else {
      setName('')
      setAmount('')
    }
  }, [investment, isOpen])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const parsedAmount = parseFloat(amount)
    if (!name.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Por favor, preencha todos os campos corretamente.')
      return
    }
    
    onSave({
      name: name.trim(),
      amount: parsedAmount
    })
    
    // Reset form
    setName('')
    setAmount('')
  }
  
  const handleClose = () => {
    setName('')
    setAmount('')
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{investment ? 'Editar Investimento' : 'Novo Investimento'}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="investment-name">Nome do Investimento</label>
            <input
              id="investment-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Bitcoin, CDB, Tesouro Direto..."
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="investment-amount">Valor (R$)</label>
            <input
              id="investment-amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {investment ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InvestmentModal
