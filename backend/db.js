const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'exptrack.db');
const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error('Failed to open database:', err);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

const init = () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      profile_photo TEXT,
      gender TEXT,
      created_at TEXT
    );
  `;

  const createProjectsTable = `
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectid TEXT UNIQUE NOT NULL,
      projectname TEXT NOT NULL,
      projectdescription TEXT,
      projectadmin INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      FOREIGN KEY(projectadmin) REFERENCES users(id)
    );
  `;

  // NEW: proper members table instead of JSON blob in projects.members
  const createProjectMembersTable = `
    CREATE TABLE IF NOT EXISTS project_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      joined_at TEXT,
      FOREIGN KEY(project_id) REFERENCES projects(projectid),
      FOREIGN KEY(user_id) REFERENCES users(id),
      UNIQUE(project_id, user_id)
    );
  `;

  const createExpensesTable = `
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectid TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      amount REAL NOT NULL,
      type TEXT NOT NULL DEFAULT 'Expense',
      category TEXT,
      paidby TEXT NOT NULL,
      splittype TEXT DEFAULT 'Equal',
      splitinto TEXT,
      addedby INTEGER NOT NULL,
      addedby_name TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      FOREIGN KEY(projectid) REFERENCES projects(projectid),
      FOREIGN KEY(addedby) REFERENCES users(id)
    );
  `;

  db.serialize(() => {
    db.run(createUsersTable, err => {
      if (err) console.error('Error creating users table:', err);
    });

    db.run(createProjectsTable, err => {
      if (err) console.error('Error creating projects table:', err);
    });

    db.run(createProjectMembersTable, err => {
      if (err) console.error('Error creating project_members table:', err);
      else migrateOldMembersIfNeeded();
    });

    db.run(createExpensesTable, err => {
      if (err) console.error('Error creating expenses table:', err);
    });

    // Ensure columns exist if the expenses table was created earlier with fewer columns
    db.all("PRAGMA table_info(expenses)", (err, rows) => {
      if (err) {
        console.error("Error reading expenses table info:", err);
        return;
      }
      const cols = rows.map(r => r.name);
      const addColumnIfMissing = (colName, colDef) => {
        if (!cols.includes(colName)) {
          db.run(`ALTER TABLE expenses ADD COLUMN ${colDef}`, err => {
            if (err) console.error(`Error adding ${colName}:`, err);
            else console.log(`${colName} column added`);
          });
        }
      };
      addColumnIfMissing("addedby_name", "addedby_name TEXT");
      addColumnIfMissing("splittype", "splittype TEXT DEFAULT 'Equal'");
      addColumnIfMissing("splitinto", "splitinto TEXT");
    });

    // Ensure columns exist if projects table was created earlier with fewer columns.
    // NOTE: membercount/members/member columns are now DEPRECATED (kept only so
    // old rows don't break) — do not write to them anymore, project_members is the
    // source of truth.
    db.all("PRAGMA table_info(projects)", (err, rows) => {
      if (err) {
        console.error('Error reading projects table info:', err);
        return;
      }
      const projectCols = rows.map(r => r.name);
      if (!projectCols.includes('updated_at')) {
        db.run('ALTER TABLE projects ADD COLUMN updated_at TEXT', err => {
          if (err) console.error('Error adding updated_at column to projects:', err);
        });
      }
    });

    // Ensure columns exist if users table was created earlier with fewer columns
    db.all("PRAGMA table_info(users)", (err, rows) => {
      if (err) {
        console.error('Error reading users table info:', err);
        return;
      }
      const cols = rows.map(r => r.name);
      const addColumnIfMissing = (colName, colDef) => {
        if (!cols.includes(colName)) {
          db.run(`ALTER TABLE users ADD COLUMN ${colDef}`, err => {
            if (err) console.error(`Error adding column ${colName}:`, err);
          });
        }
      };
      addColumnIfMissing('profile_photo', 'profile_photo TEXT');
      addColumnIfMissing('gender', 'gender TEXT');
      addColumnIfMissing('created_at', 'created_at TEXT');
    });
  });
};

// ONE-TIME MIGRATION: agar purani projects table me members JSON blob me data
// pada hai (old column 'members'), aur project_members table abhi khali hai,
// to us JSON ko project_members rows me copy kar do. Old column ko chhedte nahi,
// bas naye table ko populate karte hain taaki purana data zaya na ho.
function migrateOldMembersIfNeeded() {
  db.all("PRAGMA table_info(projects)", (err, rows) => {
    if (err) return;
    const hasOldMembersCol = rows.some(r => r.name === 'members');
    if (!hasOldMembersCol) return; // fresh DB, nothing to migrate

    db.get('SELECT COUNT(*) as count FROM project_members', [], (err, row) => {
      if (err || !row || row.count > 0) return; // already migrated / has data

      db.all('SELECT projectid, members FROM projects', [], (err, projectRows) => {
        if (err) return console.error('Migration read error:', err);

        projectRows.forEach(project => {
          let members = [];
          try {
            members = JSON.parse(project.members || '[]');
          } catch (e) {
            return;
          }
          members.forEach(m => {
            if (!m || !m.id) return;
            db.run(
              `INSERT OR IGNORE INTO project_members (project_id, user_id, joined_at)
               VALUES (?, ?, ?)`,
              [project.projectid, m.id, new Date().toISOString()],
              err => {
                if (err) console.error('Migration insert error:', err);
              }
            );
          });
        });
        console.log('Old JSON members migrated into project_members table.');
      });
    });
  });
}

module.exports = {
  db,
  init,
};