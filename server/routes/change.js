const express = require('express');
const { connection } = require('../sql_server/server');
const { LOGIN_SHEET } = require('../common/var');

const router = express.Router();

router.get('/', async (req, res) => {
  const userId = req.query.id;
  const password = req.query.password;
  const query = `
    update ${LOGIN_SHEET}
    set USERPW=${password}
    where USERID=${userId}
  `
  connection.query(query, (err, result, fields) => {
    if (err) {
      return res.send('error!');
    } else {
      return res.send('Changed successfully')
    }
  })

})

module.exports = router;