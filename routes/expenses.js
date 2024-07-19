const express = require('express');
const Expense = require('../models/Expense');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { date, amount, category, description } = req.body;
    const expense = new Expense({
      date,
      amount,
      category,
      description,
    });
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ message: 'Error creating expense', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { date, amount, category, description } = req.body;
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { date, amount, category, description },
      { new: true }
    );
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Error updating expense', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Error deleting expense', error: error.message });
  }
});

module.exports = router;
