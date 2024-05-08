const { Pool } = require("pg");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'T_Time_db',
  password: 'p05tgr35',
  port: 5432 // default PostgresSQL port
});

pool.connect((err, client, done) => {
  if (err) throw err;
  console.log(`Connected to database.`)
})

module.exports = connection;
