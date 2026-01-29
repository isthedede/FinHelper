import { useState, useMemo, useEffect } from 'react'
import { useFinance } from '../context/FinanceContext'
import { aggregateMonthlyData, calculateDelta, formatMonthLabel } from '../utils/monthlyAggregation'
import { formatCurrency } from '../utils/calculations'
import Header from '../components/Header'
import MonthlyChart from '../components/MonthlyChart'
import ComparisonCard from '../components/ComparisonCard'
import CategoryComparisonTable from '../components/CategoryComparisonTable'
import './EvolutionPage.css'

const EvolutionPage = () => {
  const { monthlyData, categoriesGoals } = useFinance()
  const [activeTab, setActiveTab] = useState('evolution')
  const [monthA, setMonthA] = useState('')
  const [monthB, setMonthB] = useState('')
  
  // Aggregate data with proper spent calculation
  const aggregatedData = useMemo(() => 
    aggregateMonthlyData(monthlyData, categoriesGoals),
    [monthlyData, categoriesGoals]
  )
  
  const availableMonths = useMemo(() => 
    Object.keys(monthlyData).sort(), // YYYY-MM format
    [monthlyData]
  )
  
  // Set default months for comparison
  useEffect(() => {
    if (availableMonths.length >= 2) {
      setMonthA(availableMonths[availableMonths.length - 2])
      setMonthB(availableMonths[availableMonths.length - 1])
    } else if (availableMonths.length === 1) {
      setMonthA(availableMonths[0])
      setMonthB(availableMonths[0])
    }
  }, [availableMonths])
  
  // Get data for comparison
  const dataA = aggregatedData.find(d => d.month === monthA)
  const dataB = aggregatedData.find(d => d.month === monthB)
  
  // Calculate deltas for comparison
  const deltas = useMemo(() => {
    if (!dataA || !dataB) return null
    
    return {
      totalExpenses: calculateDelta(dataA.totalExpenses, dataB.totalExpenses),
      savings: calculateDelta(dataA.savings, dataB.savings),
      savingsRate: calculateDelta(dataA.savingsRate, dataB.savingsRate),
      totalInvestments: calculateDelta(dataA.totalInvestments, dataB.totalInvestments),
      totalDebts: calculateDelta(dataA.totalDebts, dataB.totalDebts),
      remainingMoney: calculateDelta(dataA.remainingMoney, dataB.remainingMoney)
    }
  }, [dataA, dataB])
  
  // Empty state
  if (aggregatedData.length === 0) {
    return (
      <div className="page evolution-page">
        <Header />
        <main className="page-content">
          <h1>Evolução</h1>
          <div className="empty-state">
            <p>Ainda não há dados suficientes para visualizar a evolução.</p>
            <p>Comece adicionando dados em diferentes meses.</p>
          </div>
        </main>
      </div>
    )
  }
  
  return (
    <div className="page evolution-page">
      <Header />
      
      <main className="page-content">
        <h1>Evolução</h1>
        
        {/* Tabs */}
        <div className="evolution-tabs">
          <button 
            className={`tab-btn ${activeTab === 'evolution' ? 'active' : ''}`}
            onClick={() => setActiveTab('evolution')}
          >
            Evolução
          </button>
          <button 
            className={`tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            Comparação mês a mês
          </button>
        </div>
        
        {/* Evolution Tab */}
        {activeTab === 'evolution' && (
          <div className="charts-grid">
            <MonthlyChart 
              data={aggregatedData}
              dataKey="totalExpenses"
              title="Gastos Totais por Mês"
              colorVar="--danger"
            />
            <MonthlyChart 
              data={aggregatedData}
              dataKey="savings"
              title="Economia por Mês"
              colorVar="--success"
            />
            <MonthlyChart 
              data={aggregatedData}
              dataKey="savingsRate"
              title="Taxa de Economia (%)"
              colorVar="--accent-primary"
              isPercentage
            />
            <MonthlyChart 
              data={aggregatedData}
              dataKey="totalInvestments"
              title="Total Investido por Mês"
              colorVar="--accent-secondary"
            />
            <MonthlyChart 
              data={aggregatedData}
              dataKey="totalDebts"
              title="Dívidas Totais por Mês"
              colorVar="--warning"
            />
          </div>
        )}
        
        {/* Comparison Tab */}
        {activeTab === 'comparison' && dataA && dataB && deltas && (
          <div className="comparison-content">
            {/* Month selectors */}
            <div className="month-selectors">
              <div className="selector-group">
                <label>Mês A</label>
                <select value={monthA} onChange={(e) => setMonthA(e.target.value)}>
                  {availableMonths.map(m => (
                    <option key={m} value={m}>{formatMonthLabel(m)}</option>
                  ))}
                </select>
              </div>
              <div className="selector-group">
                <label>Mês B</label>
                <select value={monthB} onChange={(e) => setMonthB(e.target.value)}>
                  {availableMonths.map(m => (
                    <option key={m} value={m}>{formatMonthLabel(m)}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Comparison cards */}
            <div className="comparison-cards">
              <ComparisonCard 
                title="Gastos Totais"
                valueA={dataA.totalExpenses}
                valueB={dataB.totalExpenses}
                delta={deltas.totalExpenses}
              />
              <ComparisonCard 
                title="Economia Total"
                valueA={dataA.savings}
                valueB={dataB.savings}
                delta={deltas.savings}
              />
              <ComparisonCard 
                title="Taxa de Economia"
                valueA={dataA.savingsRate}
                valueB={dataB.savingsRate}
                delta={deltas.savingsRate}
                isPercentage
              />
              <ComparisonCard 
                title="Total Investido"
                valueA={dataA.totalInvestments}
                valueB={dataB.totalInvestments}
                delta={deltas.totalInvestments}
              />
              <ComparisonCard 
                title="Total de Dívidas"
                valueA={dataA.totalDebts}
                valueB={dataB.totalDebts}
                delta={deltas.totalDebts}
              />
              <ComparisonCard 
                title="Dinheiro Restante"
                valueA={dataA.remainingMoney}
                valueB={dataB.remainingMoney}
                delta={deltas.remainingMoney}
              />
            </div>
            
            {/* Category comparison table */}
            <CategoryComparisonTable 
              categoriesGoals={categoriesGoals}
              categorySpentA={dataA.categorySpent}
              categorySpentB={dataB.categorySpent}
              monthLabelA={formatMonthLabel(monthA)}
              monthLabelB={formatMonthLabel(monthB)}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default EvolutionPage
