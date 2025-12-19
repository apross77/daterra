import firebird from "node-firebird";

const dbOptions = {
  host: "daterra.ddns.net",
  port: 3050,
  database: "D:\\FCERTA\\DB\\ALTERDB.IB",
  user: "SYSDBA",
  password: "masterkey",
  lowercase_keys: false,
  role: null,
  pageSize: 4096,
  encoding: "UTF8",
};

// cria pool com até 10 conexões
const pool = firebird.pool(10, dbOptions);

function executeQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    pool.get((err, db) => {
      if (err) {
        return reject(err);
      }

      db.query(sql, params, (err, result) => {
        db.detach(); // devolve conexão ao pool

        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  });
}

export { executeQuery };
