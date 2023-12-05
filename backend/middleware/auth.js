const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const AuthError = require('../errors/auth-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Se requiere autorización');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    throw new AuthError('Se requiere autorización');
  }

  req.user = payload;

  next();
};
