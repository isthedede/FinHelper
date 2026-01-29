import { useState } from 'react'
import './SubcategoryModal.css'

const SubcategoryModal = ({ isOpen, onClose, onSave, categoryName }) => {
  const [name, setName] = useState('')
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !value) return
    
    onSave({ 
      name: name.trim(), 
      value: parseFloat(value) || 0 
    })
    
    // Reset form
    setName('')
    setValue('')
    onClose()
  }

  const handleClose = () => {
    setName('')
    setValue('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content subcategory-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Adicionar Subcategoria</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Categoria</label>
            <input 
              type="text" 
              value={categoryName}
              disabled
              className="category-name-input"
            />
          </div>

          <div className="form-group">
            <label>Nome da Subcategoria</label>
            <input
              type="text"
              placeholder="Ex: Conta de luz"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SubcategoryModal
