import jwt from 'jsonwebtoken';
import pool from '../Models/queries';
import dotenv from 'dotenv';

dotenv.config();

const Auth = {

  async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(400).send({ status:`error`, message: 'Token is not provided' });
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const text = 'SELECT * FROM teamwork.users WHERE ID = $1';
      const { rows } = await pool.query(text, [decoded.userId]);
      if (!rows[0]) {
        return res.status(400).send({ 
            status: `error`,
            message: 'The token you provided is invalid' 
        });
      }
      req.user = { userId: decoded.userId, userType: rows[0].usertype };
      next();
    } catch (error) {
      return res.status(400).send({
        status: `error`,
        message: `Oops! Could not verify token`
      });
    }
    return res;
  },
};

export default Auth.verifyToken;
