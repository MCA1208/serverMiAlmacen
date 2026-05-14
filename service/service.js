const pool = require("../conexion/cnn");

console.log("index.controllers.js");

const getUsers = async (req, res) => {
  console.log(`entro aqui`);
  const response = await pool.query("SELECT * FROM users");
  console.log(response.rows);
  res.send(response.rows);
  //res.status(200).json(response.rows);
};

module.exports = {
  getUsers,
};
