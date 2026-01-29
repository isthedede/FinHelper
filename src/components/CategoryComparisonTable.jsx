import { useMemo } from 'react'
import { formatCurrency } from '../utils/calculations'
import { calculateDelta } from '../utils/monthlyAggregation'
import './CategoryComparisonTable.css'

const CategoryComparisonTable = ({ 
  categoriesGoals, 
  categorySpentA, 
  categorySpentB,
  monthLabelA,
  monthLabelB
}) => {
  // Calculate deltas and sort by absolute difference
  const categoryComparisons = useMemo(() => {
    return categoriesGoals.map(cat => {
      const spentA = categorySpentA[cat.id] || 0
      const spentB = categorySpentB[cat.id] || 0
      const delta = calculateDelta(spentA, spentB)
      
      return {
        id: cat.id,
        name: cat.name,
        color: cat.color,
        spentA,
        spentB,
        delta
      }
    }).sort((a, b) => Math.abs(b.delta.absolute) - Math.abs(a.delta.absolute))
  }, [categoriesGoals, categorySpentA, categorySpentB])
  
  return (
    <div className="category-comparison-section">
      <h3>Comparação por Categoria</h3>
      <div className="category-comparison-table">
        <div className="table-header">
          <div>Categoria</div>
          <div>{monthLabelA}</div>
          <div>{monthLabelB}</div>
          <div>Diferença (R$)</div>
          <div>Diferença (%)</div>
        </div>
        
        {categoryComparisons.map(cat => (
          <div key={cat.id} className="table-row">
            <div className="category-name">
              <span className="cat-color" style={{ backgroundColor: cat.color }} />
              {cat.name}
            </div>
            <div>{formatCurrency(cat.spentA)}</div>
            <div>{formatCurrency(cat.spentB)}</div>
            <div className={`delta ${cat.delta.isPositive ? 'positive' : cat.delta.isNegative ? 'negative' : 'neutral'}`}>
              {cat.delta.isPositive ? '+' : ''}{formatCurrency(cat.delta.absolute)}
            </div>
            <div className={`delta ${cat.delta.isPositive ? 'positive' : cat.delta.isNegative ? 'negative' : 'neutral'}`}>
              {cat.delta.isPositive ? '+' : ''}{cat.delta.percent.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryComparisonTable
