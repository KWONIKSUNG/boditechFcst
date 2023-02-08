const express = require('express');
const { connection } = require('../sql_server/server');
const { SHEET_NAME } = require('../common/var');

const router = express.Router();

router.get('/', async (req, res) => {
  connection.query(`
    select Year, Name, Company, Catalog, Cat no, Unit, January,February,March,Aprill,May,June,July,August,September,October,November,December from ${SHEET_NAME} order by Name, Year desc
 `, (error, rows, fields) => {
    res.json([{ data: rows }]);
  })
})

module.exports = router;