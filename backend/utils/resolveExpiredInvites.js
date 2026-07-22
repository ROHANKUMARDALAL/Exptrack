const { db } = require("../db");

/**
 * resolveExpiredInvites — jo bhi "Pending" invites hain jinki expires_at
 * time nikal chuki hai (24 ghante se zyada purani), unhe automatically
 * "AutoAccepted" bana deta hai AUR us user ko project_members me daal deta hai.
 *
 * Ise cron/background job ki jagah "lazy check" ke tarike se use karte hain —
 * matlab jab bhi koi relevant API call aati hai (login, listProjects,
 * getMyInvites, sendInvite, respondInvite), sabse pehle ye function chal jata hai.
 *
 * NOTE: Render free tier pe server inactivity ke baad "so" jata hai, isliye
 * ek real-time cron (`setInterval`) bharosemand nahi hai — jab tak server
 * so raha hai, timer bhi nahi chalega. Lazy-check approach isliye zyada safe hai:
 * jaise hi koi bhi request server ko jagati hai, expired invites turant resolve ho jate hain.
 */
function resolveExpiredInvites() {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();

    db.all(
      `SELECT * FROM project_invites WHERE status = 'Pending' AND expires_at <= ?`,
      [now],
      async (err, rows) => {
        if (err) return reject(err);
        if (!rows || rows.length === 0) return resolve([]);

        try {
          for (const invite of rows) {
            // Member ko project_members me daal do
            await new Promise((res, rej) => {
              db.run(
                `INSERT OR IGNORE INTO project_members (project_id, user_id, joined_at)
                 VALUES (?, ?, ?)`,
                [invite.project_id, invite.invited_user_id, now],
                err => (err ? rej(err) : res())
              );
            });

            // Invite ko "AutoAccepted" mark kar do
            await new Promise((res, rej) => {
              db.run(
                `UPDATE project_invites SET status = 'AutoAccepted', responded_at = ? WHERE id = ?`,
                [now, invite.id],
                err => (err ? rej(err) : res())
              );
            });
          }
          resolve(rows);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
}

module.exports = resolveExpiredInvites;