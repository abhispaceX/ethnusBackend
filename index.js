const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const categoryRoutes = require('./routes/categories');
const summaryRoutes = require('./routes/summery');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'https://ethunas.netlify.app', // Your frontend URL
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
 
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));


  
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/summary', summaryRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
