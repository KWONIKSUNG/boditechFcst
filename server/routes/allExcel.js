const express = require('express');
const { connPool } = require('../sql_server/server');
const {SHEET_NAME} = require('../common/var');

const router = express.Router();

router.get('/', async(req, res) =>{
  const query = `
        select UpdateDate, userName, agency, catalog, cat_no, unit, Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec  from ${SHEET_NAME} order by userName, UpdateDate desc
    `;
    const pool = await connPool;
    const result = await pool.request().query(query);
    res.json([{data: result}]);
})

module.exports = router;