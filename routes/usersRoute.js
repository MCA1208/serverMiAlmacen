const { Router } = require("express");
const router = Router();
const pool = require("../conexion/cnn");
// const { getUsers } = require("../service/service");
const CryptoJS = require("crypto-js");

const encryp = (data, key) => {
  return CryptoJS.AES.encrypt(data, key).toString();
};

const decryp = (data, key) => {
  var wA = CryptoJS.AES.decrypt(data, key);
  return wA.toString(CryptoJS.enc.Utf8);
};

var result = { status: true, data: "" };

//#region USUARIOS PROVEEDOR
router.get("/getusers", async (req, res) => {
  let result = { status: true, data: "" };
  console.log("entro aqui 9");
  try {
    const response = await pool.query(
      `select * from users where active = true and usertypeid = 1`,
    );
    if (response.rows.length > 0) {
      result.data = response.rows;
    } else {
      result.status = false;
      result.data = "No se encontraron resultados";
      res.json({ result });
    }

    res.json({ result });
  } catch (error) {
    result.status = false;
    result.data = JSON.stringify(error);

    res.json({ result });
  }
});

router.get("/getusersbyid/:id", async (req, res) => {
  let result = { status: true, data: "" };
  try {
    const response = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.params.id,
    ]);
    console.log(response);

    if (response.rows.length > 0) {
      result.data = response.rows;
      res.json(result);
    } else {
      result.status = false;
      result.data = "No se encontraron resultados";
      res.json({ result });
    }
  } catch (error) {
    console.log(`mensaje error: '${error}'`);
    result.status = false;
    result.data = error.message;
    res.json({ result });
  }
});

router.get("/encrip/:password", async (req, res) => {
  let encrip = CryptoJS.SHA1(req.params.password).toString();
  let name = "gabriel@gmail.com";
  const getuserByID = await pool.query(
    `select password from users where email = '${name}'`,
  );

  res.json(req.params.password);
});

router.post("/createusers", async (req, res) => {
  let result = { status: true, data: "" };
  console.log(`select password from users where email ='${req.body.email}'`);
  try {
    const getuserByID = await pool.query(
      `select password from users where email ='${req.body.email}'`,
    );
    console.log(2);
    if (getuserByID.rowCount > 0) {
      result.status = false;
      result.data = JSON.stringify("El email ingresado esta repetido");
      res.json({ result });
    } else {
      const date = new Date();
      const year = date.getFullYear();
      const month = `0${date.getMonth() + 1}`.slice(-2);
      const day = `0${date.getDate()}`.slice(-2);
      console.log(3);
      const formattedDate = `${year}-${month}-${day}`;

      const passwordHash = CryptoJS.SHA1(req.body.password).toString();

      const string = `insert into users(name, email, password, modifydate, modifyuserid, active, usertypeid) values ('${req.body.name}','${req.body.email}', '${passwordHash}', '${formattedDate}', ${req.body.userId},true, ${req.body.userTypeId})`;
      console.log(string);
      const response = await pool.query(
        `insert into users(name, email, password, modifydate, modifyuserid, active, usertypeid) values ('${req.body.name}','${req.body.email}', '${passwordHash}', '${formattedDate}', ${req.body.userId},true, ${req.body.usertypeid})`,
      );

      result.data = JSON.stringify("OK");

      res.json({ result });
    }
  } catch (error) {
    result.status = false;
    result.data = JSON.stringify(error);

    res.json({ result });
  }
});

router.post("/login", async (req, res) => {
  let result = { status: true, data: "" };

  try {
    const getuserByID = await pool.query(
      `select id, email, name, password from users where email ='${req.body.email}'`,
    );
    const passwordHash = CryptoJS.SHA1(req.body.password).toString();

    let passwordUser = getuserByID.rows[0]["password"];

    if (passwordUser == passwordHash) {
      const dataUser = [
        {
          id: getuserByID.rows[0]["id"],
          email: getuserByID.rows[0]["email"],
          name: getuserByID.rows[0]["name"],
        },
      ];
      result.data = dataUser;
      res.json({ result });
    } else {
      result.status = false;
      result.data = "No coincide la contraseña";
      res.json({ result });
    }
  } catch (error) {
    result.status = false;
    result.data = error.toString();

    res.json({ result });
  }
});

router.put("/modifyuser", async (req, res) => {
  let result = { status: true, data: "" };

  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);

    const formattedDate = `${year}-${month}-${day}`;

    const response = await pool.query(
      `update users set name = '${req.body.name}', email = '${req.body.email}', isadmin =${req.body.isAdmin},  password = '${req.body.password}', modifyuserid = ${req.body.userId}, modifydate= '${formattedDate}', usertypeid = ${req.body.userTypeId} where id = ${req.body.id}`,
    );

    result.data = JSON.stringify("OK");

    res.json({ result });
  } catch (error) {
    result.status = false;
    result.data = JSON.stringify(error);

    res.json({ result });
  }
});

router.put("/deleteuser", async (req, res) => {
  let result = { status: true, data: "" };

  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);

    const formattedDate = `${year}-${month}-${day}`;
    const response = await pool.query(
      `update users set active = false, modifyuserid = ${req.body.userId}, modifydate= '${formattedDate}'  where id = ${req.body.id}`,
    );
    result.data = JSON.stringify("OK");
    res.json({ result });
  } catch (error) {
    result.status = false;
    result.data = JSON.stringify(error);

    res.json({ result });
  }
});

//#endregion

//#region USUARIOS CLIENTES

router.post("/getusersclient", async (req, res) => {
  let result = { status: true, data: "" };

  try {
    const response = await pool.query(
      `select * from users 
      inner join userclient on userclient.userid = users.id
      where active = true and usertypeid = 2`,
    );
    result.data = response.rows;

    res.json({ result });
  } catch (error) {
    result.status = false;
    result.data = JSON.stringify(error);

    res.json({ result });
  }
});

router.post("/createusersclient", async (req, res) => {
  let result = { status: true, data: "" };

  try {
    const getuserByID = await pool.query(
      `select password from users where email ='${req.body.email}'`,
    );

    if (getuserByID.rowCount > 0) {
      result.status = false;
      result.data = JSON.stringify("El email ingresado esta repetido");
      res.json({ result });
    } else {
      const date = new Date();
      const year = date.getFullYear();
      const month = `0${date.getMonth() + 1}`.slice(-2);
      const day = `0${date.getDate()}`.slice(-2);

      const formattedDate = `${year}-${month}-${day}`;

      const passwordHash = CryptoJS.SHA1(req.body.password).toString();

      const maxid = await pool.query(`select max(id) from users`);

      const newid = maxid.rows[0]["max"] + 1;

      console.log(JSON.stringify(newid));

      const response = await pool.query(
        `insert into users(name, email, password, modifydate, modifyuserid, active, usertypeid, isadmin) values ('${req.body.name}','${req.body.email}', '${passwordHash}', '${formattedDate}', ${req.body.userId},true, ${req.body.userTypeId}, false)`,
      );

      const response2 = await pool.query(
        `insert into userclient(clientid, userid) values (${req.body.clientid},${newid})`,
      );

      result.data = JSON.stringify("OK");

      res.json({ result });
    }
  } catch (error) {
    result.status = false;
    result.data = JSON.stringify(error);

    res.json({ result });
  }
});

//#endregion

module.exports = router;
