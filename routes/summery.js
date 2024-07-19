const express = require('express');
const Expense = require('../models/Expense');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, period } = req.query;
    console.log('Received summary request for dates:', startDate, endDate, 'period:', period);

    const expenses = await Expense.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    console.log('Found expenses:', JSON.stringify(expenses, null, 2));

    const summary = calculateSummary(expenses, period);

    console.log('Calculated summary:', summary);
    res.json(summary);
  } catch (error) {
    console.error('Error calculating summary:', error);
    res.status(500).json({ message: 'Error calculating summary', error: error.toString() });
  }
});

function calculateSummary(expenses, period) {
  const summary = {
    totalSpending: 0,
    spendingByCategory: {},
    spendingByPeriod: {},
  };

  expenses.forEach(expense => {
    const amount = expense.amount || 0;
    summary.totalSpending += amount;

    // Category summary
    if (expense.category) {
      summary.spendingByCategory[expense.category] = (summary.spendingByCategory[expense.category] || 0) + amount;
    }

    // Period summary
    const periodKey = getPeriodKey(expense.date, period);
    summary.spendingByPeriod[periodKey] = (summary.spendingByPeriod[periodKey] || 0) + amount;
  });

  return summary;
}

function getPeriodKey(date, period) {
  const d = new Date(date);
  switch (period) {
    case 'daily':
      return d.toISOString().split('T')[0];
    case 'weekly':
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - d.getDay());
      return d.toISOString().split('T')[0];
    case 'monthly':
    default:
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  }
}

module.exports = router;