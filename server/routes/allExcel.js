const express = require('express');
const { connection } = require('../sql_server/server');
const { SHEET_NAME } = require('../common/var');

const router = express.Router();

router.get('/', async (req, res) => {
  connection.query(`
    select UpdateDate, userName, agency, catalog, cat_no, unit, January,February,March,Aprill,May,June,July,August,September,October,November,December from ${SHEET_NAME} order by userName, UpdateDate desc
 `, (error, rows, fields) => {
    res.json([{ data: rows }]);
  })
})

module.exports = router;