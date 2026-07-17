const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const expenseController =require('../controllers/expenseController')

router.post("/addexpense", authenticate, expenseController.addExpense);
router.put("/editexpense", authenticate, expenseController.editExpense);
router.get("/allexpenses/:projectid", authenticate, expenseController.getAllExpenses);
router.delete("/deleteexpense/:expenseid",authenticate, expenseController.deleteExpense);
module.exports = router;