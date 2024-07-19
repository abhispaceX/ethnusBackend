const express = require('express');
const Category = require('../models/Category');
// const auth = require('../middleware/auth');

const router = express.Router();

router.get('/',  async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.userId });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

router.post('/',  async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ user: req.user.userId, name });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category' });
  }
});

module.exports = router;