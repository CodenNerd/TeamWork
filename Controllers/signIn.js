import pool from '../Models/queries';
import dotenv from 'dotenv';
import Helper from './Helper'

dotenv.config();

const signin = {
  async login(req, res) {
    let { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).send({ status: `error`, message: 'Some values are missing' });
    }

    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ status: `error`, message: 'Please enter a valid email address' });
    }
    email = email.trim();
    password = password.trim();
    const text = 'SELECT * FROM teamwork.users WHERE email = $1';
    try {
      const { rows } = await pool.query(text, [req.body.email]);
      if (!rows[0]) {
        return res.status(400).send({status:`error`, message: 'Wrong credentials provided'});
      }
      if (!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).send({ status:`error`, message: 'Wrong credentials provided' });
      }
      const token = await Helper.generateToken(rows[0].id);
      return res.status(202).send({
        status: `success`,
        data: {
          token,
          message: 'You are logged in',
        }
      });
    } catch (error) {
      return res.status(500).send({ error: 'Oops! Our server is down' });
    }
  },
};

export default signin.login;
