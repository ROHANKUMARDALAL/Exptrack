const expenseModel = require("../models/expenseModel");
const projectModel = require("../models/projectModel");
const userModel = require("../models/userModel");
const calculateSplit = require("../utils/calculateSplit");
const calculateSettlement = require("../utils/calculateSettlement");
const addExpense = async (req, res) => {
  try {
    const {
      projectid,
      title,
      description,
      amount,
      category,
      type,
      paidby,
      splittype,
      splitinto
    } = req.body;

    if (!projectid) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: "projectid is required" },
        Data: {}
      });
    }

    const loginUser = await userModel.findById(req.user.userId);
    if (!loginUser) {
      return res.status(404).json({
        Error: { ErrorCode: 404, ErrorMessage: "User not found" },
        Data: {}
      });
    }

    if (!title) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: "title is required" },
        Data: {}
      });
    }

    if (amount == null || Number(amount) <= 0) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: "Valid amount is required" },
        Data: {}
      });
    }

    if (!Array.isArray(paidby) || paidby.length === 0) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: "paidby is required" },
        Data: {}
      });
    }

    // Project Find
    const project = await projectModel.findByProjectId(projectid);
    if (!project) {
      return res.status(404).json({
        Error: { ErrorCode: 404, ErrorMessage: "Project not found" },
        Data: {}
      });
    }

    const members = project.members || [];

    // Login user should be a member
    const isMember = members.some(
      member => Number(member.id) === Number(req.user.userId)
    );
    if (!isMember) {
      return res.status(403).json({
        Error: { ErrorCode: 403, ErrorMessage: "You are not a member of this project" },
        Data: {}
      });
    }

    // ---------- Validate paidby (kisne kitna paisa diya) ----------
    const validatedPaidBy = [];
    const usedIds = new Set();
    let totalPaidAmount = 0;

    for (const payer of paidby) {
      if (!payer.id) {
        return res.status(400).json({
          Error: { ErrorCode: 400, ErrorMessage: "Each paidby member must contain id" },
          Data: {}
        });
      }
      if (usedIds.has(Number(payer.id))) {
        return res.status(400).json({
          Error: { ErrorCode: 400, ErrorMessage: `Duplicate member id ${payer.id} in paidby` },
          Data: {}
        });
      }
      usedIds.add(Number(payer.id));

      const member = members.find(m => Number(m.id) === Number(payer.id));
      if (!member) {
        return res.status(400).json({
          Error: { ErrorCode: 400, ErrorMessage: `User id ${payer.id} is not a member of this project` },
          Data: {}
        });
      }

      const paidAmount = Number(payer.amount);
      if (isNaN(paidAmount) || paidAmount <= 0) {
        return res.status(400).json({
          Error: { ErrorCode: 400, ErrorMessage: `Invalid amount for member ${member.name}` },
          Data: {}
        });
      }

      totalPaidAmount += paidAmount;
      validatedPaidBy.push({ id: member.id, name: member.name, amount: paidAmount });
    }

    if (Number(totalPaidAmount.toFixed(2)) !== Number(Number(amount).toFixed(2))) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: "Sum of paid amounts must be equal to expense amount" },
        Data: {}
      });
    }

    // ---------- Validate + calculate splitinto (kisko kitna owe karna hai) ----------
    // Agar client ne splitinto nahi bheja, to default: sabhi project members me Equal split
    const finalSplitType = splittype || "Equal";
    const inputSplitInto =
      Array.isArray(splitinto) && splitinto.length > 0
        ? splitinto
        : members.map(m => ({ id: m.id })); // Equal split ke liye sirf id chahiye hoti hai

    let computedSplit;
    try {
      computedSplit = calculateSplit(finalSplitType, inputSplitInto, Number(amount), members);
    } catch (err) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: err.message },
        Data: {}
      });
    }

    // FIX: created_at ab ISO format me (sortable) — display ke time frontend IST me convert kare
    const created_at = new Date().toISOString();

    const expense = await expenseModel.addExpense({
      projectid,
      title,
      description: description || "",
      amount: Number(amount),
      type: type || "Expense",
      category: category || "Other",
      paidby: JSON.stringify(validatedPaidBy),
      splittype: finalSplitType,
      splitinto: JSON.stringify(computedSplit), // FIX: pehle ye bilkul save hi nahi ho raha tha
      addedby: loginUser.id,
      addedby_name: loginUser.name,
      created_at
    });

    // Response me parsed form bhej dete hain taaki frontend ko JSON.parse na karna pade
    expense.paidby = validatedPaidBy;
    expense.splitinto = computedSplit;

    return res.status(201).json({
      Error: { ErrorCode: 0, ErrorMessage: "success" },
      Data: { expense }
    });
  } catch (err) {
    console.error("Add Expense Error :", err);
    return res.status(500).json({
      Error: { ErrorCode: 500, ErrorMessage: "Internal server error" },
      Data: {}
    });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const { projectid } = req.params;

    const project = await projectModel.findByProjectId(projectid);
    if (!project) {
      return res.status(404).json({
        Error: { ErrorCode: 404, ErrorMessage: "Project not found" },
        Data: {}
      });
    }

    const members = project.members || [];
    const isMember = members.some(
      member => Number(member.id) === Number(req.user.userId)
    );
    if (!isMember) {
      return res.status(403).json({
        Error: { ErrorCode: 403, ErrorMessage: "You are not a member of this project" },
        Data: {}
      });
    }

    const expenses = await expenseModel.getAllExpenses(projectid);

    return res.json({
      Error: { ErrorCode: 0, ErrorMessage: "success" },
      Data: { expenses }
    });
  } catch (err) {
    console.error("Get All Expenses Error :", err);
    return res.status(500).json({
      Error: { ErrorCode: 500, ErrorMessage: "Internal server error" },
      Data: {}
    });
  }
};

// NEW: project ke saare members ka balance aur settle-up list
const getSettlements = async (req, res) => {
  try {
    const { projectid } = req.params;

    const project = await projectModel.findByProjectId(projectid);
    if (!project) {
      return res.status(404).json({
        Error: { ErrorCode: 404, ErrorMessage: "Project not found" },
        Data: {}
      });
    }

    const members = project.members || [];
    const isMember = members.some(
      member => Number(member.id) === Number(req.user.userId)
    );
    if (!isMember) {
      return res.status(403).json({
        Error: { ErrorCode: 403, ErrorMessage: "You are not a member of this project" },
        Data: {}
      });
    }

    const expenses = await expenseModel.getAllExpenses(projectid);
    const { balances, settlements } = calculateSettlement(expenses);

    return res.json({
      Error: { ErrorCode: 0, ErrorMessage: "success" },
      Data: { balances, settlements }
    });
  } catch (err) {
    console.error("Get Settlements Error :", err);
    return res.status(500).json({
      Error: { ErrorCode: 500, ErrorMessage: "Internal server error" },
      Data: {}
    });
  }
};
const editExpense = async (req, res) => {
  try {
    const {
      expenseid,
      title,
      description,
      amount,
      category,
      type,
      paidby,     // FIX: pehle destructure hi nahi ho raha tha, isliye neeche crash hota tha
      splittype,
      splitinto
    } = req.body;

    if (!expenseid) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: "expenseid is required" },
        Data: {}
      });
    }

    const expense = await expenseModel.findExpenseById(expenseid);
    if (!expense) {
      return res.status(404).json({
        Error: { ErrorCode: 404, ErrorMessage: "Expense not found" },
        Data: {}
      });
    }

    const project = await projectModel.findByProjectId(expense.projectid);
    if (!project) {
      return res.status(404).json({
        Error: { ErrorCode: 404, ErrorMessage: "Project not found" },
        Data: {}
      });
    }

    const loginUserId = Number(req.user.userId);
    const isProjectAdmin = Number(project.projectadmin) === loginUserId;
    const isExpenseOwner = Number(expense.addedby) === loginUserId;

    if (!isProjectAdmin && !isExpenseOwner) {
      return res.status(403).json({
        Error: { ErrorCode: 403, ErrorMessage: "You are not allowed to edit this expense" },
        Data: {}
      });
    }

    const members = project.members || [];
    const finalAmount = amount != null ? Number(amount) : Number(expense.amount);

    // ---------- paidby recompute (sirf agar naya paidby bheja gaya ho) ----------
    let finalPaidBy = expense.paidby; // already a JSON string in DB, no change if not provided
    if (paidby) {
      if (!Array.isArray(paidby) || paidby.length === 0) {
        return res.status(400).json({
          Error: { ErrorCode: 400, ErrorMessage: "paidby must be a non-empty array" },
          Data: {}
        });
      }
      const validatedPaidBy = [];
      const usedIds = new Set();
      let totalPaidAmount = 0;

      for (const payer of paidby) {
        if (!payer.id) {
          return res.status(400).json({
            Error: { ErrorCode: 400, ErrorMessage: "Each paidby member must contain id" },
            Data: {}
          });
        }
        if (usedIds.has(Number(payer.id))) {
          return res.status(400).json({
            Error: { ErrorCode: 400, ErrorMessage: `Duplicate member id ${payer.id} in paidby` },
            Data: {}
          });
        }
        usedIds.add(Number(payer.id));

        const member = members.find(m => Number(m.id) === Number(payer.id));
        if (!member) {
          return res.status(400).json({
            Error: { ErrorCode: 400, ErrorMessage: `User id ${payer.id} is not a member of this project` },
            Data: {}
          });
        }

        const paidAmount = Number(payer.amount);
        if (isNaN(paidAmount) || paidAmount <= 0) {
          return res.status(400).json({
            Error: { ErrorCode: 400, ErrorMessage: `Invalid amount for member ${member.name}` },
            Data: {}
          });
        }

        totalPaidAmount += paidAmount;
        validatedPaidBy.push({ id: member.id, name: member.name, amount: paidAmount });
      }

      if (Number(totalPaidAmount.toFixed(2)) !== Number(finalAmount.toFixed(2))) {
        return res.status(400).json({
          Error: { ErrorCode: 400, ErrorMessage: "Sum of paid amounts must be equal to expense amount" },
          Data: {}
        });
      }

      finalPaidBy = JSON.stringify(validatedPaidBy);
    }

    // ---------- splitinto recompute (agar amount/splittype/splitinto me se koi bhi change ho) ----------
    let finalSplitType = splittype || expense.splittype || "Equal";
    let finalSplitInto = expense.splitinto;

    if (splitinto || splittype || amount != null) {
      let inputSplitInto = splitinto;
      if (!inputSplitInto) {
        try {
          inputSplitInto = JSON.parse(expense.splitinto || "[]");
        } catch (e) {
          inputSplitInto = [];
        }
      }
      try {
        const computedSplit = calculateSplit(finalSplitType, inputSplitInto, finalAmount, members);
        finalSplitInto = JSON.stringify(computedSplit);
      } catch (err) {
        return res.status(400).json({
          Error: { ErrorCode: 400, ErrorMessage: err.message },
          Data: {}
        });
      }
    }

    await expenseModel.editExpense({
      id: expenseid,
      title: title || expense.title,
      description: description ?? expense.description,
      amount: finalAmount,
      type: type || expense.type,
      category: category || expense.category,
      paidby: finalPaidBy,
      splittype: finalSplitType,
      splitinto: finalSplitInto,
      updated_at: new Date().toISOString() // FIX: ISO format, same reason as created_at
    });

    const updatedExpense = await expenseModel.findExpenseById(expenseid);
    try { updatedExpense.paidby = JSON.parse(updatedExpense.paidby); } catch (e) {}
    try { updatedExpense.splitinto = JSON.parse(updatedExpense.splitinto); } catch (e) {}

    return res.json({
      Error: { ErrorCode: 0, ErrorMessage: "success" },
      Data: { expense: updatedExpense }
    });
  } catch (err) {
    console.error("Edit Expense Error :", err);
    return res.status(500).json({
      Error: { ErrorCode: 500, ErrorMessage: "Internal server error" },
      Data: {}
    });
  }
};

// NEW: delete expense — admin ya jisne expense add ki thi, wahi delete kar sakta hai
const deleteExpense = async (req, res) => {
  try {
    const { expenseid } = req.params;
    if (!expenseid) {
      return res.status(400).json({
        Error: { ErrorCode: 400, ErrorMessage: "expenseid is required" },
        Data: {}
      });
    }

    const expense = await expenseModel.findExpenseById(expenseid);
    if (!expense) {
      return res.status(404).json({
        Error: { ErrorCode: 404, ErrorMessage: "Expense not found" },
        Data: {}
      });
    }

    const project = await projectModel.findByProjectId(expense.projectid);
    const loginUserId = Number(req.user.userId);
    const isProjectAdmin = project && Number(project.projectadmin) === loginUserId;
    const isExpenseOwner = Number(expense.addedby) === loginUserId;

    if (!isProjectAdmin && !isExpenseOwner) {
      return res.status(403).json({
        Error: { ErrorCode: 403, ErrorMessage: "You are not allowed to delete this expense" },
        Data: {}
      });
    }

    await expenseModel.deleteExpense(expenseid);

    return res.json({
      Error: { ErrorCode: 0, ErrorMessage: "success" },
      Data: { message: "Expense deleted successfully" }
    });
  } catch (err) {
    console.error("Delete Expense Error :", err);
    return res.status(500).json({
      Error: { ErrorCode: 500, ErrorMessage: "Internal server error" },
      Data: {}
    });
  }
};

module.exports = {
  addExpense,
  getAllExpenses,
  editExpense,
  deleteExpense,getSettlements
};