/**
 * calculateSettlement — saari expenses lekar decide karta hai
 * (1) har member ka net balance kya hai
 * (2) kaun kisko kitna paisa de (minimum transactions me)
 *
 * @param {Array} expenses - expenseModel.getAllExpenses() ka result
 *                            (paidby aur splitinto already parsed arrays hone chahiye)
 * @returns {{ balances: Array, settlements: Array }}
 */
function calculateSettlement(expenses) {
  const balanceMap = new Map(); // id -> { id, name, balance }

  const getEntry = (id, name) => {
    if (!balanceMap.has(id)) {
      balanceMap.set(id, { id, name, balance: 0 });
    }
    return balanceMap.get(id);
  };

  expenses.forEach(exp => {
    (exp.paidby || []).forEach(p => {
      const entry = getEntry(p.id, p.name);
      entry.balance += Number(p.amount);
    });
    (exp.splitinto || []).forEach(s => {
      const entry = getEntry(s.id, s.name);
      entry.balance -= Number(s.amount);
    });
  });

  // balances ko round karke array me convert karo
  const balances = Array.from(balanceMap.values()).map(b => ({
    id: b.id,
    name: b.name,
    balance: Number(b.balance.toFixed(2)),
  }));

  // ---------- Debt simplification (greedy) ----------
  const creditors = [];
  const debtors = [];
  balances.forEach(b => {
    if (b.balance > 0.01) creditors.push({ ...b, amount: b.balance });
    else if (b.balance < -0.01) debtors.push({ ...b, amount: -b.balance });
  });

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const settleAmt = Number(Math.min(debtor.amount, creditor.amount).toFixed(2));

    settlements.push({
      from_id: debtor.id,
      from_name: debtor.name,
      to_id: creditor.id,
      to_name: creditor.name,
      amount: settleAmt,
    });

    debtor.amount = Number((debtor.amount - settleAmt).toFixed(2));
    creditor.amount = Number((creditor.amount - settleAmt).toFixed(2));

    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  return { balances, settlements };
}

module.exports = calculateSettlement;