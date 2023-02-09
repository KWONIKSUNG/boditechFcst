const express = require('express');
const { connection } = require('../sql_server/server');
const { LOGIN_SHEET } = require('../common/var');

const router = express.Router();

router.get('/', async (req, res) => {
  let data;
  const offset = req.query.offset;
  const query = `
        select SQL_CALC_FOUND_ROWS agency from ${LOGIN_SHEET} order by agency desc limit 100 offset ${offset}
    `;
  connection.query(query, (err, result, fields) => {
    data = result || [];
  })

  connection.query(`
        SELECT FOUND_ROWS();
  `, (error, rows, filelds) => {
    res.json([{ data: data, pageNum: rows }]);
  })
})

module.exports = router;