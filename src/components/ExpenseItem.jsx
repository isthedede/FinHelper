import { useFinance } from '../context/FinanceContext'
import { formatCurrency, formatDate } from '../utils/calculations'
import './ExpenseItem.css'

const ExpenseItem = ({ expense, onDelete }) => {
  const { categoriesGoals } = useFinance()
  
  const category = categoriesGoals.find(cat => cat.id === expense.categoryId)
  
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este gasto?')) {
      onDelete(expense.id)
    }
  }
  
  return (
    <div className="expense-item">
      <div 
        className="expense-category-indicator" 
        style={{ backgroundColor: category?.color || '#ccc' }}
      />
      
      <div className="expense-details">
        <div className="expense-header">
          <span className="expense-category-name">{category?.name || 'Sem categoria'}</span>
          <span className="expense-amount">{formatCurrency(expense.amount)}</span>
        </div>
        
        <div className="expense-info">
          <span className="expense-description">
            {expense.description || 'Sem descrição'}
          </span>
          <span className="expense-date">{formatDate(expense.date)}</span>
        </div>
      </div>
      
      <button className="delete-btn" onClick={handleDelete} title="Excluir gasto">
        🗑️
      </button>
    </div>
  )
}

export default ExpenseItem
