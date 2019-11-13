import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.PASSWORD,
    port: process.env.dbPORT,
})
pool.on('connect', () => {
  console.log('connected to db...');
});

export default {

    query(queryStatement, parameters) {
      return new Promise((resolve, reject) => {
        pool.query(queryStatement, parameters)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  };
  