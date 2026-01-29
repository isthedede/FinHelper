import './MetricCard.css'

const MetricCard = ({ icon, title, value, subtitle, color = 'primary' }) => {
  return (
    <div className={`metric-card metric-card-${color}`}>
      {icon && <div className="metric-icon">{icon}</div>}
      
      <div className="metric-content">
        <h3 className="metric-title">{title}</h3>
        <p className="metric-value">{value}</p>
        {subtitle && <p className="metric-subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}

export default MetricCard
