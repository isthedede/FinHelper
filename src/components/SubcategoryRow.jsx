import { useState } from 'react'
import { formatCurrency } from '../utils/calculations'
import './SubcategoryRow.css'

const SubcategoryRow = ({ subcategory, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(subcategory.value)

  const handleSave = () => {
    const newValue = parseFloat(editValue) || 0
    onUpdate(subcategory.id, { value: newValue })
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditValue(subcategory.value)
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Deseja remover a subcategoria "${subcategory.name}"?`)) {
      onDelete(subcategory.id)
    }
  }

  return (
    <div className="subcategory-row">
      <div className="subcategory-name">{subcategory.name}</div>
      
      <div className="subcategory-value">
        {isEditing ? (
          <input
            type="number"
            step="0.01"
            min="0"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className="subcategory-input"
          />
        ) : (
          <span 
            onClick={() => setIsEditing(true)}
            className="subcategory-value-display"
          >
            {formatCurrency(subcategory.value)}
          </span>
        )}
      </div>
      
      <button 
        onClick={handleDelete}
        className="subcategory-delete-btn"
        title="Remover subcategoria"
      >
        🗑️
      </button>
    </div>
  )
}

export default SubcategoryRow
