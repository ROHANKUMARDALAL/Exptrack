const { db } = require("../db");

const addExpense = ({
  projectid,
  title,
  description,
  amount,
  type,
  category,
  paidby,
  splittype,
  splitinto,
  addedby,
  addedby_name,
  created_at
}) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO expenses
        (
          projectid, title, description, amount, type, category,
          paidby, splittype, splitinto, addedby, addedby_name, created_at
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        projectid, title, description, amount, type, category,
        paidby, splittype, splitinto, addedby, addedby_name, created_at
      ],
      function (err) {
        if (err) return reject(err);
        resolve({
          id: this.lastID,
          projectid, title, description, amount, type, category,
          paidby, splittype, splitinto, addedby, addedby_name, created_at
        });
      }
    );
  });
};

// FIX: ab splittype aur splitinto bhi update ho sakte hain (pehle missing the)
const editExpense = ({
  id,
  title,
  description,
  amount,
  type,
  category,
  paidby,
  splittype,
  splitinto,
  updated_at
}) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE expenses
       SET
         title = ?,
         description = ?,
         amount = ?,
         type = ?,
         category = ?,
         paidby = ?,
         splittype = ?,
         splitinto = ?,
         updated_at = ?
       WHERE id = ?`,
      [
        title, description, amount, type, category,
        paidby, splittype, splitinto, updated_at, id
      ],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
};

// NOTE: yahan JSON.parse jaan-bujh kar nahi kiya — editExpense controller ko
// raw JSON string chahiye hoti hai (fallback ke liye jab splitinto naya na bheja jaye).
// Frontend ko clean data chahiye to getAllExpenses use karo, wo parse karke deta hai.
const findExpenseById = id => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM expenses WHERE id = ?",
      [id],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
};

const getAllExpenses = (projectid) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT
        e.id, e.projectid, e.title, e.description, e.amount, e.type,
        e.category, e.paidby, e.splittype, e.splitinto, e.addedby,
        e.addedby_name, e.created_at, e.updated_at
       FROM expenses e
       WHERE e.projectid = ?
       ORDER BY e.id DESC`,
      [projectid],
      (err, rows) => {
        if (err) return reject(err);
        rows.forEach(expense => {
          try { expense.paidby = JSON.parse(expense.paidby); } catch (e) {}
          try { expense.splitinto = JSON.parse(expense.splitinto); } catch (e) {}
        });
        resolve(rows);
      }
    );
  });
};

// NEW: delete expense
const deleteExpense = (id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM expenses WHERE id = ?`,
      [id],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
};

module.exports = {
  addExpense,
  editExpense,
  findExpenseById,
  getAllExpenses,
  deleteExpense,
};