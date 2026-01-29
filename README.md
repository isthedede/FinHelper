# FinHelper

A comprehensive personal finance management web application that helps you organize expenses, control budgets, and set financial goals in a simple and efficient way.

## About the Project

FinHelper is a complete financial control tool that allows you to track your monthly expenses, set goals by category, and visualize your progress through intuitive dashboards and informative charts. All data is stored locally in your browser, ensuring complete privacy.

## Key Features

- **Expense Management**: Add, edit, and delete expenses with description, amount, category, and date
- **Metrics Dashboard**: Quickly view total expenses, savings, savings rate, and top spending category
- **Category Budgeting**: Define percentage distribution of income across 6 financial categories
- **Monthly Tracking**: Navigate between months and maintain complete expense history
- **Investment Portfolio**: Track and manage your investments with automatic category synchronization
- **Debt Management**: Monitor debts with due dates and payment status
- **Visual Indicators**: Color-coded alerts for expenses exceeding planned budget
- **Light/Dark Mode**: Toggle between themes according to your preference
- **Data Export**: Export reports in PDF, Excel, or complete backup in JSON
- **Backup Import**: Restore your data from exported JSON files
- **Reset Functionality**: Clear all data for the current month with confirmation

## Financial Categories

The application works with 6 predefined categories:

1. **Fixed Costs** (50% default) - Rent, utilities, essential bills
2. **Comfort** (25% default) - Leisure, entertainment, personal use
3. **Goals** (0% default) - Specific short-term objectives
4. **Pleasures** (10% default) - Small indulgences and rewards
5. **Financial Freedom** (15% default) - Investments and emergency fund
6. **Knowledge** (0% default) - Courses, books, and personal development

Percentages can be freely adjusted on the Goals page, as long as the sum is always 100%.

## Technologies Used

- **React 18** - JavaScript library for building user interfaces
- **Vite** - Modern and fast build tool
- **React Router DOM** - Page navigation
- **Recharts** - Responsive charting library
- **jsPDF** - PDF report generation
- **jsPDF-AutoTable** - Table generation for PDFs
- **xlsx** - Excel data export
- **file-saver** - Reliable file downloads
- **date-fns** - Date manipulation
- **CSS Variables** - Dark/light theme system

## Installation and Local Setup

### Prerequisites

- Node.js version 16 or higher
- npm or yarn

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/your-username/FinHelper.git
cd FinHelper
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Access in your browser:
```
http://localhost:5173
```

## Project Structure

```
FinHelper/
├── src/
│   ├── components/              # Reusable components
│   │   ├── Header.jsx           # Header with navigation and actions
│   │   ├── MonthSelector.jsx    # Month selector and income input
│   │   ├── ExpenseModal.jsx     # Modal for adding/editing expenses
│   │   ├── ExpenseItem.jsx      # Individual expense item
│   │   ├── MetricCard.jsx       # Dashboard metric card
│   │   ├── DonutChart.jsx       # Circular goals chart
│   │   ├── InvestmentModal.jsx  # Investment management modal
│   │   ├── DebtModal.jsx        # Debt management modal
│   │   ├── ConfirmModal.jsx     # Confirmation dialog
│   │   └── EditableCell.jsx     # Inline editable cell
│   ├── context/
│   │   └── FinanceContext.jsx   # Context API with global state
│   ├── pages/
│   │   ├── BudgetPage.jsx       # Main budget page
│   │   └── GoalsPage.jsx        # Goals editing page
│   ├── utils/
│   │   ├── calculations.js      # Calculation functions
│   │   ├── storage.js           # localStorage functions
│   │   └── export.js            # Export/import functions
│   ├── App.jsx                  # Root component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles and design system
├── public/                      # Static files
├── index.html                   # Base HTML
├── package.json                 # Dependencies and scripts
└── vite.config.js               # Vite configuration
```

## How to Use

### Setting Monthly Income

1. At the top of the home page, enter your monthly income in the appropriate field
2. The value will be used as the basis for calculating budgets for each category

### Adding Expenses

1. Click the "New Expense" button in the expenses section
2. Fill out the form:
   - Category: Select one of the 6 categories
   - Amount: Enter the expense amount
   - Description (optional): Add details about the expense
   - Date: Select the expense date
3. Click "Add"

### Managing Investments

1. In the "Financial Freedom - Investments" section, click "Add Investment"
2. Enter the investment name and amount
3. View your portfolio with automatic percentage calculations
4. The "Financial Freedom" category automatically reflects total investments

### Managing Debts

1. In the "Debts" section, click "Add Debt"
2. Enter debt details including due date
3. Mark debts as paid/unpaid
4. Track total debts in the overview section

### Adjusting Goals

1. Navigate to "My Goals" in the top menu
2. Use sliders to adjust percentages for each category
3. Watch the circular chart update in real-time
4. The sum of percentages must be exactly 100%
5. Click "Save" to apply changes

### Exporting Data

1. Click the export icon in the header
2. Choose your desired format:
   - **PDF**: Complete monthly report with all information including overview metrics
   - **Excel**: Spreadsheet with 5 tabs (Summary, Expenses, Investments, Debts, Goals)
   - **JSON**: Complete backup of all application data (v2.0.0 with investments and debts)

### Navigating Between Months

Use the arrows next to the displayed month to view data from previous or future months. Each month maintains its own separate expenses and data.

## Data Storage

Data is automatically saved in the browser's localStorage. This means:

- **Advantages**: Complete privacy, works offline, no registration required
- **Limitations**: Data available only in the current browser
- **Recommendation**: Export backups regularly in JSON format

## Export Features

### PDF Export
- Overview section with 5 key metrics
- Financial summary
- Category breakdown
- Investments section (if applicable)
- Debts section (if applicable)
- Detailed expense list
- Automatic pagination

### Excel Export
- 5 separate sheets with formatting
- Column auto-sizing
- Organized data structure
- Complete overview metrics

### JSON Export
- Version 2.0.0 format
- Includes investments and debts
- Backward compatible with v1.0.0
- Automatic migration on import

## Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Future Roadmap

- Monthly evolution charts
- Customizable categories
- Specific financial goals (e.g., "Save $5,000 for vacation")
- Bank statement import (CSV/OFX)
- Month-to-month comparison mode

---

**Developed with React and Vite**
