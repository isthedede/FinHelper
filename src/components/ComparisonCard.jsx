import { formatCurrency } from '../utils/calculations'
import './ComparisonCard.css'

const ComparisonCard = ({ title, valueA, valueB, delta, isPercentage = false }) => {
  const formatValue = (value) => {
    if (isPercentage) return `${value.toFixed(1)}%`
    return formatCurrency(value)
  }
  
  const formatDelta = (delta) => {
    if (isPercentage) {
      return `${delta.isPositive ? '+' : ''}${delta.absolute.toFixed(1)}pp`
    }
    return `${delta.isPositive ? '+' : ''}${formatCurrency(delta.absolute)}`
  }
  
  return (
    <div className="comparison-card">
      <h4>{title}</h4>
      <div className="comparison-values">
        <div className="value-item">
          <span className="label">Mês A</span>
          <span className="value">{formatValue(valueA)}</span>
        </div>
        <div className="value-item">
          <span className="label">Mês B</span>
          <span className="value">{formatValue(valueB)}</span>
        </div>
      </div>
      <div className={`delta ${delta.isPositive ? 'positive' : delta.isNegative ? 'negative' : 'neutral'}`}>
        <span className="delta-value">{formatDelta(delta)}</span>
        <span className="delta-percent">({delta.isPositive ? '+' : ''}{delta.percent.toFixed(1)}%)</span>
      </div>
    </div>
  )
}

export default ComparisonCard
