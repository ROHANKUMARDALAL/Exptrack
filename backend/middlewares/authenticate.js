const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const authenticate = (req, res, next) => {
  let authHeader = req.headers.authorization || req.headers.Authorization || req.headers.token || req.headers.TOKEN;
  
  let token = null;

  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      token = parts[1];
    } else {
      token = authHeader;
    }
  } else if (req.headers['x-access-token']) {
    token = req.headers['x-access-token'];
  }
  if (!token) {
    return res.status(401).json({ Error: { ErrorCode: 401, ErrorMessage: 'Unauthorized' }, Data: {} });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ Error: { ErrorCode: 401, ErrorMessage: 'Invalid token' }, Data: {} });
  }
};

module.exports = authenticate;
