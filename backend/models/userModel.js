const { db } = require('../db');

const createUser = ({ email, password, name, profile_photo, gender, created_at }) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (email, password, name, profile_photo, gender, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [email, password, name, profile_photo, gender, created_at],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      },
    );
  });
};

const findByEmail = email => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

const findById = id => {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, email, name, profile_photo, gender, created_at FROM users WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, email, name, profile_photo, gender, created_at FROM users', (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const findByIds = ids => {
  return new Promise((resolve, reject) => {
    if (!ids || !ids.length) return resolve([]);
    const placeholders = ids.map(() => '?').join(',');
    db.all(`SELECT id, email, name FROM users WHERE id IN (${placeholders})`, ids, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const findByName = name => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, email, name FROM users WHERE name = ?', [name], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const deleteUserById = id => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};
const updateUserPassword = (id, newPasswordHash) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET password = ? WHERE id = ?',
      [newPasswordHash, id],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
};
module.exports = {
  createUser,
  findByEmail,
  findById,
  getAllUsers,
  findByIds,
  findByName,
  deleteUserById,
  updateUserPassword
};
