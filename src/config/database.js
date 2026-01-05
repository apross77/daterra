import firebird from "node-firebird";

const dbOptions = {
  host: "daterra.ddns.net",
  port: 3050,
  database: "D:/FCERTA/DB/ALTERDB.IB", // 🔥 melhor usar /
  user: "SYSDBA",
  password: "masterkey",
  role: null,
  lowercase_keys: false,
  pageSize: 4096,

  // 🔴 FUNDAMENTAL NO FIREBIRD 4
  charset: "WIN1252" // ou "UTF8" se seu banco for UTF8
};

// Pool com 10 conexões
const pool = firebird.pool(10, dbOptions);

function executeQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    pool.get((err, db) => {
      if (err) {
        return reject(err);
      }

      db.query(sql, params, (err, result) => {
        // 🔥 GARANTE devolução da conexão
        try {
          db.detach();
        } catch (e) {
          console.error("Erro ao detach:", e);
        }

        if (err) {
          return reject(err);
        }

        resolve(result);
      });
    });
  });
}

export { executeQuery };

