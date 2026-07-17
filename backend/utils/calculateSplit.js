/**
 * calculateSplit — ye function decide karta hai ki expense ka amount
 * kis member ko kitna "owe" karna hai (ye hi Splitwise ka core logic hai).
 *
 * Chahe splittype kuch bhi ho (Equal / Exact / Percentage / Shares),
 * ye function hamesha SAME shape wala output deta hai:
 *   [{ id, name, amount }, ...]
 * Isse baad me "balance calculation" (kaun kisko kitna owe karta hai)
 * likhna bahut simple ho jayega — kyunki hume sirf ek hi format handle
 * karna padega, chahe expense kaise bhi split hua ho.
 *
 * @param {string} splittype - "Equal" | "Exact" | "Percentage" | "Shares"
 * @param {Array}  splitinto - input from client, format depends on splittype:
 *    Equal:      [{ id }, { id }, ...]                     (bas kaun involved hai)
 *    Exact:      [{ id, amount }, ...]                     (fixed rupees per person)
 *    Percentage: [{ id, percentage }, ...]                 (sum must be 100)
 *    Shares:     [{ id, shares }, ...]                     (ratio, jaise 1:1:2)
 * @param {number} amount - total expense amount
 * @param {Array}  members - project ke valid members [{id, name}, ...]
 * @returns {Array} [{ id, name, amount }, ...] jiska sum bilkul `amount` ke barabar ho
 * @throws {Error} agar input invalid ho (caller isse catch karke 400 bhejega)
 */
function calculateSplit(splittype, splitinto, amount, members) {
  if (!Array.isArray(splitinto) || splitinto.length === 0) {
    throw new Error("splitinto is required and cannot be empty");
  }

  const memberMap = new Map(members.map(m => [Number(m.id), m.name]));

  // Duplicate id ya invalid (non-project) member id check — sab types ke liye common
  const seen = new Set();
  splitinto.forEach(item => {
    if (!item || !item.id) {
      throw new Error("Each splitinto item must contain id");
    }
    const id = Number(item.id);
    if (seen.has(id)) {
      throw new Error(`Duplicate member id ${id} in splitinto`);
    }
    seen.add(id);
    if (!memberMap.has(id)) {
      throw new Error(`User id ${id} is not a member of this project`);
    }
  });

  // Rounding ke baad paisa ka jo bhi difference bachta hai (e.g. 100/3 = 33.33 x3 = 99.99),
  // wo last member ko de dete hain taaki total hamesha amount ke exactly barabar rahe.
  const fixRoundingDiff = (result, targetAmount) => {
    const allocated = result.reduce((sum, r) => sum + r.amount, 0);
    const diff = Number((targetAmount - allocated).toFixed(2));
    if (diff !== 0) {
      result[result.length - 1].amount = Number(
        (result[result.length - 1].amount + diff).toFixed(2)
      );
    }
    return result;
  };

  let result = [];

  switch (splittype) {
    case "Equal": {
      const n = splitinto.length;
      const share = Math.floor((amount / n) * 100) / 100;
      result = splitinto.map(item => ({
        id: Number(item.id),
        name: memberMap.get(Number(item.id)),
        amount: share,
      }));
      result = fixRoundingDiff(result, amount);
      break;
    }

    case "Exact": {
      let sum = 0;
      result = splitinto.map(item => {
        const amt = Number(item.amount);
        if (isNaN(amt) || amt < 0) {
          throw new Error(`Invalid amount for member id ${item.id}`);
        }
        sum += amt;
        return { id: Number(item.id), name: memberMap.get(Number(item.id)), amount: amt };
      });
      if (Number(sum.toFixed(2)) !== Number(Number(amount).toFixed(2))) {
        throw new Error("Sum of splitinto amounts must equal expense amount");
      }
      break;
    }

    case "Percentage": {
      let sumPct = 0;
      const withPct = splitinto.map(item => {
        const pct = Number(item.percentage);
        if (isNaN(pct) || pct <= 0) {
          throw new Error(`Invalid percentage for member id ${item.id}`);
        }
        sumPct += pct;
        return { id: Number(item.id), name: memberMap.get(Number(item.id)), percentage: pct };
      });
      if (Number(sumPct.toFixed(2)) !== 100) {
        throw new Error("Sum of percentages must equal 100");
      }
      result = withPct.map(r => ({
        id: r.id,
        name: r.name,
        amount: Number(((amount * r.percentage) / 100).toFixed(2)),
      }));
      result = fixRoundingDiff(result, amount);
      break;
    }

    case "Shares": {
      let totalShares = 0;
      const withShares = splitinto.map(item => {
        const shares = Number(item.shares);
        if (isNaN(shares) || shares <= 0) {
          throw new Error(`Invalid shares for member id ${item.id}`);
        }
        totalShares += shares;
        return { id: Number(item.id), name: memberMap.get(Number(item.id)), shares };
      });
      result = withShares.map(r => ({
        id: r.id,
        name: r.name,
        amount: Number(((amount * r.shares) / totalShares).toFixed(2)),
      }));
      result = fixRoundingDiff(result, amount);
      break;
    }

    default:
      throw new Error(`Unsupported splittype: ${splittype}. Use Equal, Exact, Percentage or Shares`);
  }

  return result;
}

module.exports = calculateSplit;