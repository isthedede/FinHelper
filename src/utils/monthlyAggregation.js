// Calculate category spent respecting subcategories and snapshots
const calculateCategorySpent = (categoriesGoals, manualCategorySpent, snapshotSpent) => {
  const spent = {}
  
  categoriesGoals.forEach(cat => {
    // 1. Try to use snapshot if available (best for history)
    if (snapshotSpent && snapshotSpent[cat.id] !== undefined) {
      spent[cat.id] = snapshotSpent[cat.id]
    } 
    // 2. If category has subcategories in CURRENT global state (fallback), sum them
    // Note: This is less accurate for history if subcategories changed, but needed for backwards compat
    else if (cat.subcategories && cat.subcategories.length > 0) {
      spent[cat.id] = cat.subcategories.reduce((sum, sub) => sum + Number(sub.value || 0), 0)
    } 
    // 3. Otherwise use manual value
    else {
      spent[cat.id] = Number(manualCategorySpent?.[cat.id] || 0)
    }
  })
  
  return spent
}

// Aggregate monthly data for charts
export const aggregateMonthlyData = (monthlyData, categoriesGoals) => {
  if (!monthlyData) return []
  
  const months = Object.keys(monthlyData).sort() // YYYY-MM format
  
  return months.map(monthKey => {
    const data = monthlyData[monthKey]
    const income = data.income || 0
    
    // Calculate category spent (respecting subcategories)
    const categorySpent = calculateCategorySpent(
      categoriesGoals, 
      data.manualCategorySpent,
      data.snapshotSpent // New field for historical accuracy
    )
    
    // Total expenses (sum of all categories)
    const totalExpenses = Object.values(categorySpent).reduce((sum, val) => sum + val, 0)
    
    // Savings = Income - Total Expenses (same as main page)
    const savings = income - totalExpenses
    
    // Savings rate
    const savingsRate = income > 0 ? (savings / income) * 100 : 0
    
    // Total investments (from monthlyData snapshot)
    const totalInvestments = (data.investments || [])
      .reduce((sum, inv) => sum + inv.amount, 0)
    
    // Total debts (from monthlyData snapshot)
    const totalDebts = (data.debts || [])
      .reduce((sum, debt) => sum + debt.amount, 0)
    
    // Remaining money = Income - Total Expenses (same as savings)
    const remainingMoney = savings
    
    return {
      month: monthKey, // YYYY-MM
      monthLabel: formatMonthLabel(monthKey), // Jan/2026
      income,
      totalExpenses,
      savings,
      savingsRate,
      totalInvestments,
      totalDebts,
      remainingMoney,
      categorySpent // For category comparison
    }
  })
}

// Format month key to readable label
export const formatMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split('-')
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${months[parseInt(month) - 1]}/${year}`
}

// Calculate delta between two values
export const calculateDelta = (valueA, valueB) => {
  const diff = valueB - valueA
  const percentChange = valueA !== 0 ? (diff / Math.abs(valueA)) * 100 : 0
  
  return {
    absolute: diff,
    percent: percentChange,
    isPositive: diff > 0,
    isNegative: diff < 0,
    isNeutral: diff === 0
  }
}
