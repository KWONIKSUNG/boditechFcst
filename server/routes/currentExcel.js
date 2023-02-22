const express = require('express');
const { connection } = require('../sql_server/server');
const { SHEET_NAME } = require('../common/var');

const router = express.Router();

router.get('/', async (req, res) => {
  connection.query(`
        select
          Year, Name, Company, Catalog, Cat_no, Unit, January,February,March,Aprill,May,June,July,August,September,October,November,December
        from
          ${SHEET_NAME}
        where 
          Company='${req.query.agency}'
  `, (error, rows, filelds) => {
    res.json(rows);
  })
})

module.exports = router;
