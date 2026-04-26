import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const tokenParts = token.split(' ');
  const tokenValue = tokenParts.length === 2 ? tokenParts[1] : tokenParts[0];

  jwt.verify(tokenValue, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.adminId = decoded.id;
    next();
  });
};
