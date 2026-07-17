const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const signup = async (req, res) => {
  try {
    const { name, email, password, profile_photo, gender } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ Error: { ErrorCode: 400, ErrorMessage: 'Name, email and password are required' }, Data: {} });
    }

    const existing = await userModel.findByEmail(email);
    if (existing) return res.status(409).json({ Error: { ErrorCode: 409, ErrorMessage: 'Email already registered' }, Data: {} });

    const passwordHash = bcrypt.hashSync(password, 10);
    const created_at = new Date().toISOString();

    const result = await userModel.createUser({
      email,
      password: passwordHash,
      name,
      profile_photo: profile_photo || null,
      gender: gender || null,
      created_at,
    });

    const token = jwt.sign({ userId: result.id, email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({ Error: { ErrorCode: 0, ErrorMessage: 'success' }, Data: { token, user: { id: result.id, email, name, profile_photo: profile_photo || null, gender: gender || null, created_at } } });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ Error: { ErrorCode: 500, ErrorMessage: 'Internal server error' }, Data: {} });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ Error: { ErrorCode: 400, ErrorMessage: 'Email and password are required' }, Data: {} });

    const user = await userModel.findByEmail(email);
    if (!user) return res.status(401).json({ Error: { ErrorCode: 401, ErrorMessage: 'Invalid credentials' }, Data: {} });

    const passwordMatches = bcrypt.compareSync(password, user.password);
    if (!passwordMatches) return res.status(401).json({ Error: { ErrorCode: 401, ErrorMessage: 'Invalid credentials' }, Data: {} });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({ Error: { ErrorCode: 0, ErrorMessage: 'success' }, Data: { token, user: { id: user.id, email: user.email, name: user.name, profile_photo: user.profile_photo || null, gender: user.gender || null, created_at: user.created_at || null } } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ Error: { ErrorCode: 500, ErrorMessage: 'Internal server error' }, Data: {} });
  }
};

const profile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId);
    if (!user) return res.status(404).json({ Error: { ErrorCode: 404, ErrorMessage: 'User not found' }, Data: {} });
    return res.json({ Error: { ErrorCode: 0, ErrorMessage: 'success' }, Data: { user } });
  } catch (err) {
    console.error('Profile error:', err);
    return res.status(500).json({ Error: { ErrorCode: 500, ErrorMessage: 'Internal server error' }, Data: {} });
  }
};

const listUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    return res.json({ Error: { ErrorCode: 0, ErrorMessage: 'success' }, Data: { users } });
  } catch (err) {
    console.error('List users error:', err);
    return res.status(500).json({ Error: { ErrorCode: 500, ErrorMessage: 'Internal server error' }, Data: {} });
  }
};

const deleteUser = async (req, res) => {
  try {
    const requestedId = req.body.id || req.query.id || req.params.id;
    const loggedInUserId = Number(req.user.userId);

    if (requestedId && Number(requestedId) !== loggedInUserId) {
      return res.status(403).json({ Error: { ErrorCode: 403, ErrorMessage: 'Forbidden: cannot delete another user' }, Data: {} });
    }

    const deletedCount = await userModel.deleteUserById(loggedInUserId);
    if (!deletedCount) {
      return res.status(404).json({ Error: { ErrorCode: 404, ErrorMessage: 'User not found' }, Data: {} });
    }

    return res.json({ Error: { ErrorCode: 0, ErrorMessage: 'success' }, Data: { message: 'User account deleted successfully' } });
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({ Error: { ErrorCode: 500, ErrorMessage: 'Internal server error' }, Data: {} });
  }
};



module.exports = {
  signup,
  login,
  profile,
  listUsers,
  deleteUser,
};
