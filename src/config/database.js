import firebird from "node-firebird";

const dbOptions = {
    host: '186.210.187.133',
    port: 3050,
    database: 'D:\\FCERTA\\DB\\ALTERDB.IB',
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: false, // set to true to lowercase keys
    role: null, // default
    pageSize: 4096, // default when creating database
    retryConnectionInterval: 1000, // reconnect interval in case of connection drop
    blobAsText: false, // set to true to get blob as text, only affects blob subtype 1
    encoding: 'UTF8', // default encoding for connection is UTF-8    
};

function executeQuery(ssql, params, callback)
{

firebird.attach(dbOptions, function (err, db) {

  if (err) 
    {
        return callback(err, []);
    }
  
    // db = DATABASE
    db.query(ssql, params, function (err, result)
    {
      
      db.detach();

      if (err) {
        return callback(err, [])
    } else {
        return callback(undefined, result) ;
        }
    })

    });
  };


export {executeQuery};
