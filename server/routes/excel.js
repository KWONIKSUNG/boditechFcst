const express = require('express');
const { connection } = require('../sql_server/server');
const { SHEET_NAME, GET_SHEET_NAME } = require('../common/var');

const router = express.Router();

router.get('/', async (req, res) => {
  connection.query(`
        select
          UpdateDate, userName, agency, catalog, cat_no, unit, January,February,March,Aprill,May,June,July,August,September,October,November,December
        from
          ${SHEET_NAME}
        where 
          agency='${req.query.agency}'
        order by 
          UpdateDate desc
  `, (error, rows, filelds) => {
    res.json([{ data: rows }]);
  })
})

router.post('/', async (req, res) => {
  connection.connect();
  const newArr = req.body.data.form;

  for (let i = 0; i < newArr.length; i++) {
    let cat_no = newArr[i][4];
    let agency = newArr[i][2];
    let UpdateDate = newArr[i][0];
    const param = newArr[i];
    const value = param.map(prop => "'" + prop + "'");
    value.push('getDate()');
    const convertValue = value.map(prop => {
      if (isNaN(Number(prop))) {
        return prop;
      } else {
        return Number(prop);
      }
    });

    connection.query(`
    if(exists( select userName from ${SHEET_NAME} where (cat_no = '${cat_no}' and agency = '${agency}' and UpdateDate = '${UpdateDate}')))
      begin
      delete ${SHEET_NAME} where (cat_no = '${cat_no}' and agency = '${agency}' and UpdateDate = '${UpdateDate}')
      insert into ${SHEET_NAME}
      (UpdateDate, userName, agency, catalog, cat_no, unit, Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec, InsertDate)
      values(${convertValue})
      end
      else if (exists( select userName from ${SHEET_NAME} where (cat_no = '${cat_no}' and agency = '${agency}')))
      begin
      insert into ${SHEET_NAME}
      (UpdateDate, userName, agency, catalog, cat_no, unit, Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec, InsertDate)
      values(${convertValue})
      end
      else if (not exists ( select userName from ${SHEET_NAME} where (cat_no = '${cat_no}' and agency = '${agency}')))
      begin
      insert into ${SHEET_NAME}
      (UpdateDate, userName, agency, catalog, cat_no, unit, Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec, InsertDate)
      values(${convertValue})
      end
    `, (error, rows, fields) => {
      res.json([{ data: '데이터 업로드 성공!' }]);
    })
  }
  connection.end();
})

module.exports = router;