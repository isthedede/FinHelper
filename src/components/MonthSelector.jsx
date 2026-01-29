import { useFinance } from '../context/FinanceContext'
import { formatCurrency, getMonthYearString } from '../utils/calculations'
import './MonthSelector.css'

const MonthSelector = () => {
  const { selectedMonth, changeMonth, monthlyIncome, updateMonthlyIncome } = useFinance()
  
  const handleIncomeChange = (e) => {
    const value = parseFloat(e.target.value) || 0
    updateMonthlyIncome(value)
  }
  
  return (
    <div className="month-selector">
      <div className="month-navigation">
        <button 
          className="month-btn" 
          onClick={() => changeMonth(-1)}
          title="Mês Anterior"
        >
          ‹
        </button>
        
        <span className="month-display">
          {getMonthYearString(selectedMonth)}
        </span>
        
        <button 
          className="month-btn" 
          onClick={() => changeMonth(1)}
          title="Próximo Mês"
        >
          ›
        </button>
      </div>
      
      <div className="income-input-wrapper">
        <label htmlFor="monthlyIncome">Renda do mês</label>
        <input
          id="monthlyIncome"
          type="number"
          value={monthlyIncome}
          onChange={handleIncomeChange}
          placeholder="R$ 0,00"
          min="0"
          step="100"
        />
        <span className="income-display">{formatCurrency(monthlyIncome)}</span>
      </div>
    </div>
  )
}

export default MonthSelector
