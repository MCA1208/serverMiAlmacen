const { Router } = require("express");
const router = Router();
const pool = require("../conexion/cnn");

//#region  METODOS POST
router.get("/getprovince", async (req, res) => {
  let result = { status: true, data: "" };
  try {
    const response = await pool.query(
      `SELECT * FROM province where countryid ='${req.body.countryid}'`
    );
    result.data = response.rows;
    res.json({ result });
  } catch (error) {
    result.status = false;
    result.data = JSON.stringify(error);

    res.json({ result });
  }
});
//#endregion

//#region METODOS PUT
//#endregion

module.exports = router;
