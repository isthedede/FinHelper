import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../utils/calculations'
import './MonthlyChart.css'

const MonthlyChart = ({ data, dataKey, title, colorVar, isPercentage = false }) => {
  // Use CSS variable directly
  const color = `var(${colorVar})`
  
  const formatValue = (value) => {
    if (isPercentage) return `${value.toFixed(1)}%`
    return formatCurrency(value)
  }
  
  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis 
            dataKey="monthLabel" 
            stroke="var(--text-muted)"
            style={{ fontSize: '0.75rem' }}
          />
          <YAxis 
            stroke="var(--text-muted)"
            style={{ fontSize: '0.75rem' }}
            tickFormatter={formatValue}
          />
          <Tooltip 
            formatter={formatValue}
            contentStyle={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthlyChart
