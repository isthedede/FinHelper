import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { saveData, loadData } from '../utils/storage'
import {
  calculateTotalSpent,
  calculateSavingsRate,
  getTopCategory,
  getMonthKey,
} from '../utils/calculations'
import { exportToPDF, exportToExcel, exportToJSON, importFromJSON } from '../utils/export'

const FinanceContext = createContext()

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}

// Default categories with predefined percentages (recommended values)
const DEFAULT_CATEGORIES = [
  { id: 'custos-fixos', name: 'Custos fixos', color: '#4a90e2', percentage: 35, subcategories: [] },
  { id: 'conforto', name: 'Conforto', color: '#00d4aa', percentage: 15, subcategories: [] },
  { id: 'metas', name: 'Metas', color: '#f5d547', percentage: 10, subcategories: [] },
  { id: 'prazeres', name: 'Prazeres', color: '#d946ef', percentage: 10, subcategories: [] },
  { id: 'liberdade', name: 'Liberdade financeira', color: '#60a5fa', percentage: 25, subcategories: [] },
  { id: 'conhecimento', name: 'Conhecimento', color: '#fb923c', percentage: 5, subcategories: [] },
]

export const FinanceProvider = ({ children }) => {
  // Load initial state from localStorage
  const [theme, setTheme] = useState(() => loadData('theme', 'dark'))
  const [userName, setUserName] = useState(() => loadData('userName', null))
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const saved = loadData('selectedMonth')
    return saved ? new Date(saved) : new Date()
  })
  const [categoriesGoals, setCategoriesGoals] = useState(() => 
    loadData('categoriesGoals', DEFAULT_CATEGORIES)
  )
  
  // Monthly data structure: { 'YYYY-MM': { income, expenses } }
  const [monthlyData, setMonthlyData] = useState(() => 
    loadData('monthlyData', {})
  )

  // Financial Goals (Phase 2)
  const [financialGoals, setFinancialGoals] = useState(() => 
    loadData('financialGoals', [])
  )
  
  // Get current month key
  const currentMonthKey = useMemo(() => getMonthKey(selectedMonth), [selectedMonth])
  
  // Get current month data
  const currentData = useMemo(() => {
    return monthlyData[currentMonthKey] || {
      income: 0,
      expenses: [],
      investments: [],
      debts: [] // Add debts array
    }
  }, [monthlyData, currentMonthKey])
  
  const monthlyIncome = currentData.income
  const expenses = currentData.expenses
  
  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    saveData('theme', theme)
  }, [theme])
  
  useEffect(() => {
    saveData('userName', userName)
  }, [userName])
  
  useEffect(() => {
    saveData('selectedMonth', selectedMonth.toISOString())
  }, [selectedMonth])
  
  useEffect(() => {
    saveData('categoriesGoals', categoriesGoals)
  }, [categoriesGoals])
  
  useEffect(() => {
    saveData('monthlyData', monthlyData)
  }, [monthlyData])

  useEffect(() => {
    saveData('financialGoals', financialGoals)
  }, [financialGoals])
  
  
  // Computed values
  const categorySpent = useMemo(() => {
    const spent = {}
    const manualSpent = currentData.manualCategorySpent || {}
    
    categoriesGoals.forEach(cat => {
      // If category has subcategories, sum them
      if (cat.subcategories && cat.subcategories.length > 0) {
        spent[cat.id] = cat.subcategories.reduce((sum, sub) => sum + Number(sub.value || 0), 0)
      } else {
        // Otherwise use manual value if set, or calculate from expenses
        spent[cat.id] = manualSpent[cat.id] !== undefined 
          ? Number(manualSpent[cat.id])
          : calculateTotalSpent(expenses, cat.id)
      }
    })
    return spent
  }, [expenses, categoriesGoals, currentData.manualCategorySpent])
  
  
  const totalExpenses = useMemo(() => {
    // Sum all category spent values (includes manual overrides)
    return Object.values(categorySpent).reduce((sum, amount) => sum + amount, 0)
  }, [categorySpent])
  
  const savingsAmount = useMemo(() => {
    // Investments are already included in totalExpenses via "Liberdade Financeira" category
    // So we only subtract totalExpenses, not investments separately
    return monthlyIncome - totalExpenses
  }, [monthlyIncome, totalExpenses])
  
  const savingsRate = useMemo(() => {
    return calculateSavingsRate(monthlyIncome, totalExpenses)
  }, [monthlyIncome, totalExpenses])
  
  const topCategory = useMemo(() => {
    return getTopCategory(expenses, categoriesGoals)
  }, [expenses, categoriesGoals])
  
  // Investments computed values
  const investments = currentData.investments || []
  
  const totalInvestments = useMemo(() => {
    return investments.reduce((sum, inv) => sum + (inv.amount || 0), 0)
  }, [investments])
  
  // Debts computed values
  const debts = currentData.debts || []
  
  const totalDebts = useMemo(() => {
    return debts.reduce((sum, debt) => sum + (debt.amount || 0), 0)
  }, [debts])
  
  const totalPaidDebts = useMemo(() => {
    return debts
      .filter(debt => debt.isPaid)
      .reduce((sum, debt) => sum + (debt.amount || 0), 0)
  }, [debts])
  
  const totalUnpaidDebts = useMemo(() => {
    return debts
      .filter(debt => !debt.isPaid)
      .reduce((sum, debt) => sum + (debt.amount || 0), 0)
  }, [debts])
  
  // Functions
  const updateMonthlyIncome = (income) => {
    setMonthlyData(prev => ({
      ...prev,
      [currentMonthKey]: {
        ...prev[currentMonthKey],
        income: income,
        expenses: currentData.expenses
      }
    }))
  }
  
  const updateCategoryGoal = (categoryId, percentage) => {
    setCategoriesGoals(prev => 
      prev.map(cat => 
        cat.id === categoryId ? { ...cat, percentage } : cat
      )
    )
  }
  
  const addExpense = (categoryId, amount, description, date) => {
    const newExpense = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      categoryId,
      amount,
      description: description || '',
      date: date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
    
    setMonthlyData(prev => ({
      ...prev,
      [currentMonthKey]: {
        ...currentData,
        expenses: [...currentData.expenses, newExpense]
      }
    }))
  }
  
  const updateExpense = (expenseId, updates) => {
    setMonthlyData(prev => ({
      ...prev,
      [currentMonthKey]: {
        ...currentData,
        expenses: currentData.expenses.map(exp =>
          exp.id === expenseId ? { ...exp, ...updates } : exp
        )
      }
    }))
  }
  
  const removeExpense = (expenseId) => {
    setMonthlyData(prev => ({
      ...prev,
      [currentMonthKey]: {
        ...currentData,
        expenses: currentData.expenses.filter(exp => exp.id !== expenseId)
      }
    }))
  }
  
  const resetGoals = () => {
    setCategoriesGoals(DEFAULT_CATEGORIES)
  }
  
  const changeMonth = (direction) => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + direction)
      return newDate
    })
  }
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }
  
  const updateCategorySpent = (categoryId, amount) => {
    setMonthlyData(prev => ({
      ...prev,
      [currentMonthKey]: {
        ...currentData,
        manualCategorySpent: {
          ...(currentData.manualCategorySpent || {}),
          [categoryId]: amount
        }
      }
    }))
  }
  
  // Investment management functions
  const addInvestment = (name, amount) => {
    const newInvestment = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      amount,
      createdAt: new Date().toISOString()
    }
    
    setMonthlyData(prev => ({
      ...prev,
      [currentMonthKey]: {
        ...currentData,
        investments: [...(currentData.investments || []), newInvestment]
      }
    }))
  }
  
  const updateInvestment = (investmentId, updates) => {
    setMonthlyData(prev => ({
      ...prev,
      [currentMonthKey]: {
        ...currentData,
        investments: (currentData.investments || []).map(inv =>
          inv.id === investmentId ? { ...inv, ...updates } : inv
        )
      }
    }))
  }
  
  const removeInvestment = (investmentId) => {
    setMonthlyData(prev => ({
      ...prev,
      [currentMonthKey]: {
        ...currentData,
        investments: (currentData.investments || []).filter(inv => inv.id !== investmentId)
      }
    }))
  }
  
  // Debt management functions
  const addDebt = (name, amount, dueDate, isPaid = false) => {
    const newDebt = {
      id: `debt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      amount,
      dueDate: dueDate || new Date().toISOString(),
      isPaid,
      createdAt: new Date().toISOString()
    }
    
    setMonthlyData(prev => ({
      ...prev,
      [currentMonthKey]: {
        ...currentData,
        debts: [...(currentData.debts || []), newDebt]
      }
    }))
  }
  
  const updateDebt = (debtId, updates) => {
    setMonthlyData(prev => ({
      ...prev,
      [currentMonthKey]: {
        ...currentData,
        debts: (currentData.debts || []).map(debt =>
          debt.id === debtId ? { ...debt, ...updates } : debt
        )
      }
    }))
  }
  
  const removeDebt = (debtId) => {
    setMonthlyData(prev => ({
      ...prev,
      [currentMonthKey]: {
        ...currentData,
        debts: (currentData.debts || []).filter(debt => debt.id !== debtId)
      }
    }))
  }
  
  const toggleDebtPaid = (debtId) => {
    setMonthlyData(prev => ({
      ...prev,
      [currentMonthKey]: {
        ...currentData,
        debts: (currentData.debts || []).map(debt =>
          debt.id === debtId ? { ...debt, isPaid: !debt.isPaid } : debt
        )
      }
    }))
  }
  
  const resetAll = () => {
    if (window.confirm('Tem certeza que deseja resetar todos os dados do mês atual? Esta ação não pode ser desfeita.')) {
      setMonthlyData(prev => ({
        ...prev,
        [currentMonthKey]: {
          income: 0,
          expenses: [],
          investments: [],
          debts: [],
          manualCategorySpent: {}
        }
      }))
    }
  }
  
  // Category Management Functions (Phase 1)
  const addCategory = (categoryData) => {
    const newCategory = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: categoryData.name,
      color: categoryData.color,
      percentage: Number(categoryData.percentage),
      subcategories: [], // Initialize empty subcategories
      isArchived: false,
      isCustom: true
    }
    
    setCategoriesGoals(prev => [...prev, newCategory])
    return { success: true, id: newCategory.id }
  }

  const updateCategory = (categoryId, updates) => {
    setCategoriesGoals(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, ...updates } : cat
    ))
    return { success: true }
  }

  const deleteCategory = (categoryId) => {
    // Check if category has any historical usage (spent > 0 in any month)
    // This requires checking all monthlyData snapshots
    const hasHistory = Object.values(monthlyData).some(monthData => {
      // Check expenses
      const hasExpenses = (monthData.expenses || []).some(exp => exp.categoryId === categoryId)
      // Check manual spent
      const hasManual = (monthData.manualCategorySpent || {})[categoryId] > 0
      // Check snapshot
      const hasSnapshot = (monthData.snapshotSpent || {})[categoryId] > 0
      
      return hasExpenses || hasManual || hasSnapshot
    })

    const category = categoriesGoals.find(c => c.id === categoryId)
    if (category) {
      // Check subcategories usage
      const hasSubcategories = category.subcategories && category.subcategories.length > 0 && category.subcategories.some(sub => sub.value > 0);
      if (hasSubcategories) {
         return { success: false, error: 'Esta categoria possui subcategorias com valores definidos e não pode ser excluída.' }
      }
    }

    if (hasHistory) {
      return { success: false, error: 'Esta categoria possui histórico financeiro e não pode ser excluída.' }
    }

    setCategoriesGoals(prev => prev.filter(cat => cat.id !== categoryId))
    return { success: true }
  }

  const validateBudgetTotal = (newCategoryPercentage, excludeCategoryId = null) => {
    const currentTotal = categoriesGoals
      .filter(cat => cat.id !== excludeCategoryId)
      .reduce((sum, cat) => sum + (cat.percentage || 0), 0)
    
    return (currentTotal + newCategoryPercentage) <= 100
  }

  // Financial Goals Management (Phase 2)
  const addGoal = (goalData) => {
    const newGoal = {
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: goalData.name,
      targetAmount: Number(goalData.targetAmount),
      currentAmount: Number(goalData.currentAmount || 0),
      createdAt: new Date().toISOString()
    }

    setFinancialGoals(prev => [...prev, newGoal])
    return { success: true, id: newGoal.id }
  }

  const updateGoal = (goalId, updates) => {
    setFinancialGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            ...updates, 
            targetAmount: updates.targetAmount !== undefined ? Number(updates.targetAmount) : goal.targetAmount,
            currentAmount: updates.currentAmount !== undefined ? Number(updates.currentAmount) : goal.currentAmount
          } 
        : goal
    ))
    return { success: true }
  }

  const deleteGoal = (goalId) => {
    setFinancialGoals(prev => prev.filter(goal => goal.id !== goalId))
    return { success: true }
  }

  // Subcategory management functions
  const addSubcategory = (categoryId, subcategoryData) => {
    setCategoriesGoals(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { 
            ...cat, 
            subcategories: [
              ...(cat.subcategories || []), 
              {
                id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: subcategoryData.name,
                value: Number(subcategoryData.value || 0)
              }
            ]
          }
        : cat
    ))
  }

  const updateSubcategory = (categoryId, subcategoryId, updates) => {
    setCategoriesGoals(prev => prev.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            subcategories: (cat.subcategories || []).map(sub =>
              sub.id === subcategoryId 
                ? { ...sub, ...updates, value: updates.value !== undefined ? Number(updates.value) : sub.value } 
                : sub
            )
          }
        : cat
    ))
  }

  const removeSubcategory = (categoryId, subcategoryId) => {
    setCategoriesGoals(prev => prev.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            subcategories: (cat.subcategories || []).filter(sub => sub.id !== subcategoryId)
          }
        : cat
    ))
  }
  
  // Persist current month's calculated category spent AND names to snapshot
  useEffect(() => {
    if (currentMonthKey && categorySpent) {
      const currentSnapshotSpent = currentData.snapshotSpent || {}
      const currentSnapshotNames = currentData.snapshotCategoryNames || {}
      
      const hasSpentChanges = Object.keys(categorySpent).some(
        key => categorySpent[key] !== currentSnapshotSpent[key]
      )
      
      // Check if names need updating (if not present)
      const hasNameChanges = categoriesGoals.some(cat => currentSnapshotNames[cat.id] !== cat.name)

      if (hasSpentChanges || hasNameChanges) {
        // Create map of current category names
        const categoryNames = {}
        categoriesGoals.forEach(cat => {
          categoryNames[cat.id] = cat.name
        })

        setMonthlyData(prev => ({
          ...prev,
          [currentMonthKey]: {
            ...prev[currentMonthKey],
            snapshotSpent: categorySpent,
            snapshotCategoryNames: { ...currentSnapshotNames, ...categoryNames }
          }
        }))
      }
    }
  }, [categorySpent, currentMonthKey, currentData, categoriesGoals])

  const exportData = (format) => {
    const exportDataObj = {
      monthlyIncome,
      totalExpenses,
      savings: savingsAmount,
      savingsRate,
      categories: categoriesGoals,
      categorySpent,
      expenses: expenses,
      investments: investments,
      debts: debts,
      totalInvestments,
      totalDebts,
      totalPaidDebts,
      totalUnpaidDebts
    }
    
    switch (format) {
      case 'pdf':
        exportToPDF(exportDataObj, selectedMonth)
        break
      case 'excel':
        exportToExcel(exportDataObj, selectedMonth)
        break
      case 'json':
        exportToJSON({
          theme,
          userName,
          categoriesGoals,
          monthlyData,
          financialGoals
        })
        break
      default:
        console.error('Unknown export format:', format)
    }
  }
  
  const importData = async (file) => {
    try {
      const data = await importFromJSON(file)
      
      if (data.theme) setTheme(data.theme)
      if (data.userName) setUserName(data.userName)
      if (data.categoriesGoals) setCategoriesGoals(data.categoriesGoals)
      if (data.monthlyData) setMonthlyData(data.monthlyData)
      if (data.financialGoals) setFinancialGoals(data.financialGoals)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  
  const value = {
    // State
    theme,
    userName,
    selectedMonth,
    monthlyData,
    monthlyIncome,
    categoriesGoals,
    expenses,
    investments,
    debts,
    financialGoals,
    
    // Computed values
    categorySpent,
    totalExpenses,
    savingsAmount,
    savingsRate,
    topCategory,
    totalInvestments,
    totalDebts,
    totalPaidDebts,
    totalUnpaidDebts,
    
    // Functions
    updateMonthlyIncome,
    updateCategoryGoal,
    addExpense,
    updateExpense,
    removeExpense,
    resetGoals,
    changeMonth,
    toggleTheme,
    updateCategorySpent,
    addInvestment,
    updateInvestment,
    removeInvestment,
    addDebt,
    updateDebt,
    removeDebt,
    toggleDebtPaid,
    resetAll,
    resetAll,
    addSubcategory,
    updateSubcategory,
    removeSubcategory,
    addCategory,
    updateCategory,
    deleteCategory,
    addGoal,
    updateGoal,
    deleteGoal,
    validateBudgetTotal,
    exportData,
    importData,
    setUserName,
  }
  
  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}
