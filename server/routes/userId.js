const express = require('express');
const { connection } = require('../sql_server/server');
const { LOGIN_SHEET } = require('../common/var');

const router = express.Router();

router.get('/', async (req, res) => {
  const query = `
    select agency from ${LOGIN_SHEET} where userId = '${req.query.userId}'
  `
  connection.query(query, (err, result, fields) => {
    if (err) throw err;
    res.json({ data: result[0].agency })
  })

})

module.exports = router;