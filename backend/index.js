require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { init } = require('./db');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const expenseRoutes = require("./routes/expenses");

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Initialize Database
init();

// Routes
app.use('/api', authRoutes);
app.use('/api', projectRoutes);
app.use("/api", expenseRoutes);
// Start Server
app.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
});