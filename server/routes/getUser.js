const express = require('express');
const { connection } = require('../sql_server/server');
const { LOGIN_SHEET } = require('../common/var');

const router = express.Router();

router.get('/', async (req, res) => {
  const query = `
        select agency from ${LOGIN_SHEET} order by agency desc
    `;
  connection.query(query, (err, result, fields) => {
    res.json([{ data: result }]);
  })
})

module.exports = router;