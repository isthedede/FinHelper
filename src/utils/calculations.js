// Utility functions for financial calculations

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export const calculateBudget = (income, percentage) => {
  return (income * percentage) / 100
}

export const calculateTotalSpent = (expenses, categoryId) => {
  return expenses
    .filter(expense => expense.categoryId === categoryId)
    .reduce((sum, expense) => sum + expense.amount, 0)
}

export const calculateUtilization = (spent, budget) => {
  if (budget === 0) return 0
  return (spent / budget) * 100
}

export const calculateSavingsRate = (income, totalExpenses) => {
  if (income === 0) return 0
  return ((income - totalExpenses) / income) * 100
}

export const getTopCategory = (expenses, categories) => {
  if (expenses.length === 0) return null
  
  const categoryTotals = {}
  
  expenses.forEach(expense => {
    if (!categoryTotals[expense.categoryId]) {
      categoryTotals[expense.categoryId] = 0
    }
    categoryTotals[expense.categoryId] += expense.amount
  })
  
  let topCategoryId = null
  let maxAmount = 0
  
  Object.entries(categoryTotals).forEach(([id, amount]) => {
    if (amount > maxAmount) {
      maxAmount = amount
      topCategoryId = id
    }
  })
  
  const topCategory = categories.find(cat => cat.id === topCategoryId)
  
  return {
    category: topCategory,
    amount: maxAmount
  }
}

export const redistributeGoals = (categories, changedIndex, newValue) => {
  const updatedCategories = [...categories]
  updatedCategories[changedIndex].percentage = newValue
  
  // Calculate total of other categories
  let totalOthers = 0
  updatedCategories.forEach((cat, i) => {
    if (i !== changedIndex) {
      totalOthers += cat.percentage
    }
  })
  
  // Calculate remaining percentage
  const remaining = 100 - newValue
  
  if (totalOthers === 0) {
    // If all others are zero, distribute evenly
    const perCategory = remaining / (categories.length - 1)
    updatedCategories.forEach((cat, i) => {
      if (i !== changedIndex) {
        cat.percentage = Math.round(perCategory)
      }
    })
  } else {
    // Redistribute proportionally
    const ratio = remaining / totalOthers
    updatedCategories.forEach((cat, i) => {
      if (i !== changedIndex) {
        cat.percentage = Math.round(cat.percentage * ratio)
      }
    })
  }
  
  // Ensure total is exactly 100%
  const total = updatedCategories.reduce((sum, cat) => sum + cat.percentage, 0)
  if (total !== 100 && updatedCategories.length > 0) {
    updatedCategories[0].percentage += (100 - total)
  }
  
  return updatedCategories
}

export const getMonthYearString = (date) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${month}/${year}`
}

export const getMonthKey = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${year}-${month}`
}
