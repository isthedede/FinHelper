import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import './DonutChart.css'

const DonutChart = ({ categories }) => {
  // Filter out categories with 0% to avoid visual clutter
  const dataToShow = categories.filter(cat => cat.percentage > 0)
  
  const data = dataToShow.map(cat => ({
    name: cat.name,
    value: cat.percentage,
    color: cat.color
  }))
  
  return (
    <div className="donut-chart-container">
      {dataToShow.length === 0 ? (
        <div className="empty-chart">
          <p>Defina suas metas usando os sliders abaixo</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default DonutChart
