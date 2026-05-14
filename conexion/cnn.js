const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "admin",
  database: "mialmacen",
  port: "5433",
});

//########### KEY Exernal DEV ###########
// const pool = new Pool({
//   connectionString:
//     "postgresql://logi_6437_user:N71lYNwpcji4Oye2wJ5cp1WQet6PTLjh@dpg-ctpt9jbtq21c739rhpi0-a.virginia-postgres.render.com/logi_6437",
//   ssl: true,
// });

//########### KEY Exernal PROD ###########
// const pool = new Pool({
//   connectionString:
//     "postgresql://logi_6437_user:N71lYNwpcji4Oye2wJ5cp1WQet6PTLjh@dpg-ctpt9jbtq21c739rhpi0-a/logi_6437",
// });

module.exports = pool;
