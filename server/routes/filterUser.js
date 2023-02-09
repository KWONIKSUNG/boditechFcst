const express = require('express');
const { connection } = require('../sql_server/server');
const { LOGIN_SHEET } = require('../common/var');

const router = express.Router();

router.get('/', async (req, res) => {
  const agency = req.query.agency;
  const query = `
        select agency from userInfo where agency like '%${agency}%'
    `;
  connection.query(query, (err, result, fields) => {
    if (err) {
      console.error(err);
    }
    res.json([{ data: result }]);
  })
})

module.exports = router;