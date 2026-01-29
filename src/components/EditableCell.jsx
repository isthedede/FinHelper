import { useState, useEffect, useRef } from 'react'
import './EditableCell.css'

const EditableCell = ({ value, onSave, categoryId }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState('')
  const inputRef = useRef(null)
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])
  
  const handleDoubleClick = () => {
    // Format for editing: convert 1750.50 to "175050"
    const cents = Math.round(value * 100)
    setTempValue(cents.toString())
    setIsEditing(true)
  }
  
  const handleSave = () => {
    const numericValue = parseToNumber(tempValue)
    if (!isNaN(numericValue) && numericValue >= 0) {
      onSave(categoryId, numericValue)
      setIsEditing(false)
    } else {
      // Invalid value, cancel
      handleCancel()
    }
  }
  
  const handleCancel = () => {
    setIsEditing(false)
    setTempValue('')
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }
  
  const handleChange = (e) => {
    // Only allow digits
    const value = e.target.value.replace(/\D/g, '')
    setTempValue(value)
  }
  
  const parseToNumber = (val) => {
    const cleanValue = val.replace(/\D/g, '')
    if (cleanValue === '') return 0
    return parseFloat(cleanValue) / 100
  }
  
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val)
  }
  
  const formatInputDisplay = (val) => {
    if (val === '' || val === '0') return ''
    const number = parseToNumber(val)
    return formatCurrency(number)
  }
  
  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={formatInputDisplay(tempValue)}
        onChange={handleChange}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="editable-input"
        placeholder="R$ 0,00"
      />
    )
  }
  
  return (
    <div 
      className="editable-cell"
      onDoubleClick={handleDoubleClick}
      title="Clique duplo para editar"
    >
      {formatCurrency(value)}
    </div>
  )
}

export default EditableCell
