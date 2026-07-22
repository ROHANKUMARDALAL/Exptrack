const { db } = require("../db");

const createInvite = ({ project_id, invited_user_id, invited_by, created_at, expires_at }) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO project_invites
        (project_id, invited_user_id, invited_by, status, created_at, expires_at)
       VALUES (?, ?, ?, 'Pending', ?, ?)`,
      [project_id, invited_user_id, invited_by, created_at, expires_at],
      function (err) {
        if (err) return reject(err);
        resolve({
          id: this.lastID,
          project_id,
          invited_user_id,
          invited_by,
          status: 'Pending',
          created_at,
          expires_at,
        });
      }
    );
  });
};

const findPendingInvite = (project_id, invited_user_id) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM project_invites
       WHERE project_id = ? AND invited_user_id = ? AND status = 'Pending'`,
      [project_id, invited_user_id],
      (err, row) => (err ? reject(err) : resolve(row))
    );
  });
};

const findInviteById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM project_invites WHERE id = ?`, [id], (err, row) =>
      err ? reject(err) : resolve(row)
    );
  });
};

// Logged-in user ke saare pending invites — project aur invite-bhejne-wale ka naam bhi saath me
const getMyPendingInvites = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT
        pi.id, pi.project_id, pi.status, pi.created_at, pi.expires_at,
        p.projectname, p.projectdescription,
        u.name AS invited_by_name
       FROM project_invites pi
       JOIN projects p ON p.projectid = pi.project_id
       JOIN users u ON u.id = pi.invited_by
       WHERE pi.invited_user_id = ? AND pi.status = 'Pending'
       ORDER BY pi.created_at DESC`,
      [userId],
      (err, rows) => (err ? reject(err) : resolve(rows))
    );
  });
};

const respondToInvite = (id, status, responded_at) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE project_invites SET status = ?, responded_at = ? WHERE id = ?`,
      [status, responded_at, id],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
};

module.exports = {
  createInvite,
  findPendingInvite,
  findInviteById,
  getMyPendingInvites,
  respondToInvite,
};