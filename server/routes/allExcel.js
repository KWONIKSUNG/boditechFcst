const express = require('express');
const { connection } = require('../sql_server/server');
const { SHEET_NAME } = require('../common/var');

const router = express.Router();

router.get('/', async (req, res) => {
  let data;
  const offset = req.query.offset;
  connection.query(`
    select SQL_CALC_FOUND_ROWS Year, Name, Company, Catalog, Cat_no, Unit, January,February,March,Aprill,May,June,July,August,September,October,November,December from ${SHEET_NAME} limit 30 offset ${offset}
 `, (error, rows, fields) => {
    data = rows;
  })
  connection.query(`
        SELECT FOUND_ROWS();
  `, (error, rows, filelds) => {
    res.json({ data: data, pageNum: rows });
  })
})

module.exports = router;