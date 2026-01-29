import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { formatCurrency, formatDate, getMonthYearString } from './calculations'

// Export data to PDF with enhanced formatting
export const exportToPDF = (data, monthDate) => {
  const doc = new jsPDF()
  const monthYear = getMonthYearString(monthDate)
  const accentColor = [212, 162, 89]
  
  // Title
  doc.setFontSize(20)
  doc.setTextColor(...accentColor)
  doc.text('FinHelper - Relatório Financeiro', 14, 20)
  
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text(`Período: ${monthYear}`, 14, 28)
  
  // Visão Geral do Mês
  doc.setFontSize(14)
  doc.text('Visão Geral do Mês', 14, 40)
  
  const overviewData = [
    ['Total de Renda', formatCurrency(data.monthlyIncome)],
    ['Total de Gastos', formatCurrency(data.totalExpenses)],
    ['Total Investido', formatCurrency(data.totalInvestments || 0)],
    ['Total de Dívidas', formatCurrency(data.totalDebts || 0)],
    ['Dinheiro Restante', formatCurrency(data.monthlyIncome - data.totalExpenses)],
  ]
  
  doc.autoTable({
    startY: 45,
    head: [['Métrica', 'Valor']],
    body: overviewData,
    theme: 'grid',
    headStyles: { fillColor: accentColor },
  })
  
  // Summary Section
  let currentY = doc.lastAutoTable.finalY + 10
  doc.setFontSize(14)
  doc.text('Resumo Financeiro', 14, currentY)
  
  const summaryData = [
    ['Total Economizado', formatCurrency(data.savings)],
    ['Taxa de Economia', `${data.savingsRate.toFixed(1)}%`],
  ]
  
  doc.autoTable({
    startY: currentY + 5,
    head: [['Métrica', 'Valor']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: accentColor },
  })
  
  // Category Summary Section
  currentY = doc.lastAutoTable.finalY + 10
  doc.setFontSize(14)
  doc.text('Resumo de Gastos por Categoria', 14, currentY)
  
  const categoryData = data.categories.map(cat => {
    const budget = data.monthlyIncome * cat.percentage / 100
    const spent = data.categorySpent[cat.id] || 0
    const remaining = budget - spent
    const utilization = budget > 0 ? (spent / budget * 100).toFixed(1) : 0
    
    return [
      cat.name,
      formatCurrency(budget),
      formatCurrency(spent),
      formatCurrency(remaining),
      `${utilization}%`
    ]
  })
  
  doc.autoTable({
    startY: currentY + 5,
    head: [['Categoria', 'Orçamento', 'Gasto', 'Restante', 'Utilizado']],
    body: categoryData,
    theme: 'grid',
    headStyles: { fillColor: accentColor },
  })
  
  // Investments Section
  if (data.investments && data.investments.length > 0) {
    currentY = doc.lastAutoTable.finalY + 10
    
    if (currentY > 250) {
      doc.addPage()
      currentY = 20
    }
    
    doc.setFontSize(14)
    doc.text('Investimentos', 14, currentY)
    
    const investmentsData = data.investments.map(inv => {
      const percentage = data.totalInvestments > 0 ? (inv.amount / data.totalInvestments * 100).toFixed(1) : 0
      return [
        inv.name,
        formatCurrency(inv.amount),
        `${percentage}%`
      ]
    })
    
    investmentsData.push(['TOTAL', formatCurrency(data.totalInvestments), '100%'])
    
    doc.autoTable({
      startY: currentY + 5,
      head: [['Investimento', 'Valor', '% Carteira']],
      body: investmentsData,
      theme: 'grid',
      headStyles: { fillColor: accentColor },
      foot: [['TOTAL', formatCurrency(data.totalInvestments), '100%']],
      footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' },
    })
  }
  
  // Debts Section
  if (data.debts && data.debts.length > 0) {
    currentY = doc.lastAutoTable.finalY + 10
    
    if (currentY > 250) {
      doc.addPage()
      currentY = 20
    }
    
    doc.setFontSize(14)
    doc.text('Dívidas', 14, currentY)
    
    const debtsData = data.debts.map(debt => [
      debt.name,
      formatCurrency(debt.amount),
      formatDate(debt.dueDate),
      debt.isPaid ? 'Paga' : 'Pendente'
    ])
    
    doc.autoTable({
      startY: currentY + 5,
      head: [['Descrição', 'Valor', 'Vencimento', 'Status']],
      body: debtsData,
      theme: 'grid',
      headStyles: { fillColor: accentColor },
    })
  }
  
  // Expenses List
  if (data.expenses.length > 0) {
    currentY = doc.lastAutoTable.finalY + 10
    
    if (currentY > 250) {
      doc.addPage()
      currentY = 20
    }
    
    doc.setFontSize(14)
    doc.text('Lista Detalhada de Gastos', 14, currentY)
    
    const expensesData = data.expenses.map(exp => {
      const category = data.categories.find(c => c.id === exp.categoryId)
      return [
        formatDate(exp.date),
        category?.name || 'N/A',
        exp.description || 'Sem descrição',
        formatCurrency(exp.amount)
      ]
    })
    
    doc.autoTable({
      startY: currentY + 5,
      head: [['Data', 'Categoria', 'Descrição', 'Valor']],
      body: expensesData,
      theme: 'grid',
      headStyles: { fillColor: accentColor },
    })
  }
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Gerado em ${formatDate(new Date())} - Página ${i} de ${pageCount}`,
      14,
      doc.internal.pageSize.height - 10
    )
  }
  
  const fileName = `FinHelper_${monthYear.replace('/', '_')}.pdf`
  const pdfBlob = doc.output('blob')
  saveAs(pdfBlob, fileName)
}

// Export data to Excel with styling
export const exportToExcel = (data, monthDate) => {
  const monthYear = getMonthYearString(monthDate)
  const workbook = XLSX.utils.book_new()
  
  // Sheet 1: Resumo com Visão Geral
  const summaryData = [
    ['FinHelper - Relatório Financeiro'],
    [`Período: ${monthYear}`],
    [],
    ['Visão Geral do Mês'],
    ['Total de Renda', data.monthlyIncome],
    ['Total de Gastos', data.totalExpenses],
    ['Total Investido', data.totalInvestments || 0],
    ['Total de Dívidas', data.totalDebts || 0],
    ['Dinheiro Restante', data.monthlyIncome - data.totalExpenses],
    [],
    ['Resumo Financeiro'],
    ['Total Economizado', data.savings],
    ['Taxa de Economia (%)', data.savingsRate.toFixed(2)],
    [],
    ['Resumo por Categoria'],
    ['Categoria', 'Meta (%)', 'Orçamento', 'Gasto', 'Restante', 'Utilizado (%)'],
    ...data.categories.map(cat => {
      const budget = data.monthlyIncome * cat.percentage / 100
      const spent = data.categorySpent[cat.id] || 0
      const remaining = budget - spent
      const utilization = budget > 0 ? (spent / budget * 100).toFixed(2) : 0
      
      return [
        cat.name,
        cat.percentage,
        budget,
        spent,
        remaining,
        utilization
      ]
    })
  ]
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  
  // Apply column widths
  summarySheet['!cols'] = [
    { wch: 25 }, // Column A
    { wch: 15 }, // Column B
    { wch: 15 }, // Column C
    { wch: 15 }, // Column D
    { wch: 15 }, // Column E
    { wch: 15 }  // Column F
  ]
  
  // Apply styles to headers
  const headerCells = ['A1', 'A4', 'A11', 'A15']
  headerCells.forEach(cell => {
    if (summarySheet[cell]) {
      summarySheet[cell].s = {
        font: { bold: true, sz: 14, color: { rgb: 'D4A259' } },
        fill: { fgColor: { rgb: 'F5F5F5' } }
      }
    }
  })
  
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo')
  
  // Sheet 2: Gastos
  const expensesData = [
    ['Lista de Gastos'],
    [`Período: ${monthYear}`],
    [],
    ['Data', 'Categoria', 'Descrição', 'Valor'],
    ...data.expenses.map(exp => {
      const category = data.categories.find(c => c.id === exp.categoryId)
      return [
        formatDate(exp.date),
        category?.name || 'N/A',
        exp.description || 'Sem descrição',
        exp.amount
      ]
    })
  ]
  
  const expensesSheet = XLSX.utils.aoa_to_sheet(expensesData)
  expensesSheet['!cols'] = [
    { wch: 12 },
    { wch: 20 },
    { wch: 40 },
    { wch: 15 }
  ]
  
  XLSX.utils.book_append_sheet(workbook, expensesSheet, 'Gastos')
  
  // Sheet 3: Investimentos
  if (data.investments && data.investments.length > 0) {
    const investmentsData = [
      ['Investimentos'],
      [`Período: ${monthYear}`],
      [],
      ['Investimento', 'Valor', '% Carteira'],
      ...data.investments.map(inv => {
        const percentage = data.totalInvestments > 0 ? (inv.amount / data.totalInvestments * 100).toFixed(2) : 0
        return [inv.name, inv.amount, percentage]
      }),
      [],
      ['TOTAL', data.totalInvestments, 100]
    ]
    
    const investmentsSheet = XLSX.utils.aoa_to_sheet(investmentsData)
    investmentsSheet['!cols'] = [
      { wch: 30 },
      { wch: 15 },
      { wch: 15 }
    ]
    
    XLSX.utils.book_append_sheet(workbook, investmentsSheet, 'Investimentos')
  }
  
  // Sheet 4: Dívidas
  if (data.debts && data.debts.length > 0) {
    const debtsData = [
      ['Dívidas'],
      [`Período: ${monthYear}`],
      [],
      ['Descrição', 'Valor', 'Vencimento', 'Status'],
      ...data.debts.map(debt => [
        debt.name,
        debt.amount,
        formatDate(debt.dueDate),
        debt.isPaid ? 'Paga' : 'Pendente'
      ]),
      [],
      ['Total de Dívidas', data.totalDebts],
      ['Dívidas Pagas', data.totalPaidDebts || 0],
      ['Dívidas Pendentes', data.totalUnpaidDebts || 0]
    ]
    
    const debtsSheet = XLSX.utils.aoa_to_sheet(debtsData)
    debtsSheet['!cols'] = [
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 }
    ]
    
    XLSX.utils.book_append_sheet(workbook, debtsSheet, 'Dívidas')
  }
  
  // Sheet 5: Metas
  const goalsData = [
    ['Metas Financeiras'],
    [`Período: ${monthYear}`],
    [],
    ['Categoria', 'Meta (%)', 'Orçamento (R$)'],
    ...data.categories.map(cat => [
      cat.name,
      cat.percentage,
      data.monthlyIncome * cat.percentage / 100
    ])
  ]
  
  const goalsSheet = XLSX.utils.aoa_to_sheet(goalsData)
  goalsSheet['!cols'] = [
    { wch: 25 },
    { wch: 12 },
    { wch: 15 }
  ]
  
  XLSX.utils.book_append_sheet(workbook, goalsSheet, 'Metas')
  
  const fileName = `FinHelper_${monthYear.replace('/', '_')}.xlsx`
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, fileName)
}

// Export all data to JSON v2.0.0
export const exportToJSON = (allData) => {
  const exportData = {
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    data: allData
  }
  
  const dataStr = JSON.stringify(exportData, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const fileName = `FinHelper_backup_${Date.now()}.json`
  saveAs(blob, fileName)
}

// Import data from JSON with version compatibility
export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result)
        
        // Validate structure
        if (!importedData.version || !importedData.data) {
          reject(new Error('Arquivo JSON inválido'))
          return
        }
        
        let data = importedData.data
        
        // Migration from v1.0.0 to v2.0.0
        if (importedData.version === '1.0.0') {
          console.log('Migrando dados de v1.0.0 para v2.0.0...')
          
          // Add investments and debts to each month if they don't exist
          if (data.monthlyData) {
            Object.keys(data.monthlyData).forEach(monthKey => {
              if (!data.monthlyData[monthKey].investments) {
                data.monthlyData[monthKey].investments = []
              }
              if (!data.monthlyData[monthKey].debts) {
                data.monthlyData[monthKey].debts = []
              }
            })
          }
        }
        
        resolve(data)
      } catch (error) {
        reject(new Error('Erro ao ler arquivo JSON'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'))
    }
    
    reader.readAsText(file)
  })
}
