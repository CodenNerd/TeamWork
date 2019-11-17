import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const database = process.env.NODE_ENV == 'test' ? process.env.test_db : process.env.DB;
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: database,
   // database: process.env.test_db,
    password: process.env.PASSWORD,
    port: process.env.dbPORT,
})
pool.on('connect', () => {
  console.log('connected to db...', process.env.test_db, process.env.NODE_ENV);
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
  