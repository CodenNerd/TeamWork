import { Pool } from 'pg';
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'teamwork',
    password: 'atanda508',
    port: 5432,
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
  