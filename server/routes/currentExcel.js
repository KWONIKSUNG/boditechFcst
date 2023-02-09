const express = require('express');
const { connection } = require('../sql_server/server');
const { SHEET_NAME } = require('../common/var');

const router = express.Router();

router.get('/', async (req, res) => {
  const offset = req.query.offset;
  let data;

  connection.query(`
        select
          SQL_CALC_FOUND_ROWS Year, Name, Company, Catalog, Cat_no, Unit, January,February,March,Aprill,May,June,July,August,September,October,November,December
        from
          ${SHEET_NAME}
        where 
          Company='${req.query.agency}'
        order by 
          Year desc
        limit 30 offset ${offset}
  `, (error, rows, filelds) => {
    data = rows;
  })

  connection.query(`
        SELECT FOUND_ROWS();
  `, (error, rows, filelds) => {
    res.json([{ data: data, pageNum: rows }]);
  })
})

module.exports = router;
