const { db } = require("../db");

// Helper: ek project ke saare members nikalo (users table se joined)
const getMembers = (projectid) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT u.id, u.name
       FROM project_members pm
       JOIN users u ON u.id = pm.user_id
       WHERE pm.project_id = ?`,
      [projectid],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
};

const createProject = async ({
  projectid,
  projectname,
  projectdescription,
  projectadmin,
  created_at,
  members, // array of {id, name}
}) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO projects
        (projectid, projectname, projectdescription, projectadmin, created_at)
       VALUES (?,?,?,?,?)`,
      [projectid, projectname, projectdescription, projectadmin, created_at],
      function (err) {
        if (err) return reject(err);
        resolve();
      }
    );
  }).then(() => {
    // Har member ke liye ek row project_members me daalo
    const insertMember = (member) =>
      new Promise((resolve, reject) => {
        db.run(
          `INSERT OR IGNORE INTO project_members (project_id, user_id, joined_at)
           VALUES (?, ?, ?)`,
          [projectid, member.id, created_at],
          err => {
            if (err) return reject(err);
            resolve();
          }
        );
      });

    return Promise.all(members.map(insertMember)).then(() => ({
      projectid,
      projectname,
      projectdescription,
      projectadmin,
      created_at,
      membercount: members.length,
      members,
    }));
  });
};

// Ab SQL JOIN se seedha filter hota hai, JS me loop nahi karna padta
const getProjectsByMember = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT DISTINCT p.*
       FROM projects p
       JOIN project_members pm ON pm.project_id = p.projectid
       WHERE pm.user_id = ?
       ORDER BY p.created_at DESC`,
      [userId],
      (err, rows) => {
        if (err) return reject(err);
        Promise.all(
          rows.map(project =>
            getMembers(project.projectid).then(members => ({
              ...project,
              members,
              membercount: members.length,
            }))
          )
        )
          .then(resolve)
          .catch(reject);
      }
    );
  });
};

const findByProjectId = (projectid) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM projects WHERE projectid = ?`,
      [projectid],
      (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        getMembers(projectid)
          .then(members => {
            row.members = members;
            row.membercount = members.length;
            resolve(row);
          })
          .catch(reject);
      }
    );
  });
};

// Check karo ki user is project ka member hai ya nahi (direct SQL, JS loop nahi)
const isMember = (projectid, userId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT 1 FROM project_members WHERE project_id = ? AND user_id = ?`,
      [projectid, userId],
      (err, row) => {
        if (err) return reject(err);
        resolve(!!row);
      }
    );
  });
};

const addMember = (projectid, userId) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR IGNORE INTO project_members (project_id, user_id, joined_at)
       VALUES (?, ?, ?)`,
      [projectid, userId, new Date().toISOString()],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0); // false agar already member tha (INSERT OR IGNORE)
      }
    );
  });
};
const getPendingInvitations = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT p.projectid, p.projectname, p.projectadmin, pm.invited_at 
       FROM projects p
       JOIN project_members pm ON p.projectid = pm.project_id
       WHERE pm.user_id = ? AND pm.status = 'pending'`,
      [userId],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
};

const acceptInvitation = (projectid, userId) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE project_members SET status = 'accepted' WHERE project_id = ? AND user_id = ? AND status = 'pending'`,
      [projectid, userId],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
};

const rejectInvitation = (projectid, userId) => {
  // Reject means simply delete the row from project_members
  return removeMember(projectid, userId); 
};

// 24 Hrs Auto-Accept logic
const autoAcceptOldInvitations = () => {
  return new Promise((resolve, reject) => {
    db.run(
      // SQLite me datetime logic use karke check karega jo 24 hours se purane hain
      `UPDATE project_members 
       SET status = 'accepted' 
       WHERE status = 'pending' 
       AND datetime(invited_at) <= datetime('now', '-24 hours')`,
      [],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes); // Returns kitne members auto accept hue
      }
    );
  });
};

const removeMember = (projectid, userId) => {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM project_members WHERE project_id = ? AND user_id = ?`,
      [projectid, userId],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
};

const editProject = (projectid, { projectname, projectdescription }) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE projects
       SET projectname = COALESCE(?, projectname),
           projectdescription = COALESCE(?, projectdescription),
           updated_at = ?
       WHERE projectid = ?`,
      [projectname || null, projectdescription || null, new Date().toISOString(), projectid],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
};

const deleteProject = (projectid) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`DELETE FROM project_members WHERE project_id = ?`, [projectid]);
      db.run(`DELETE FROM expenses WHERE projectid = ?`, [projectid]);
      db.run(`DELETE FROM projects WHERE projectid = ?`, [projectid], function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  });
};

module.exports = {
  createProject,
  getProjectsByMember,
  findByProjectId,
  isMember,
  addMember,
  removeMember,
  editProject,
  deleteProject,
};