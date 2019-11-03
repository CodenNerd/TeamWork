import { Pool } from pg;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'TeamWork',
    password: 'atanda508',
    port: 5432,
})

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
  