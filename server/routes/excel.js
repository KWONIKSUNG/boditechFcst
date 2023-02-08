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
  const newArr = req.body.data.form;
  const arrToSql = [];

  for (let i = 0; i < newArr.length; i++) {
    let cat_no = newArr[i][4];
    let agency = newArr[i][2];
    let UpdateDate = newArr[i][0];
    const param = newArr[i];
    const zeroCount = param.filter(elem => elem === 0 || elem === '0').length;
    console.log(zeroCount);
    if (zeroCount > 13) continue;
    // const value = param.map(prop => "'" + prop + "'");
    param.push('date(now())');
    const convertValue = param.map(prop => {
      if (isNaN(Number(prop))) {
        return prop;
      } else {
        return Number(prop);
      }
    });
    arrToSql.push({
      cat_no: cat_no,
      agency: agency,
      UpdateDate: UpdateDate,
      convertValue: convertValue
    })
  }

  arrToSql.forEach((props) => {
    const query = `
    insert into ${SHEET_NAME} values (?) on duplicate key update UpdateDate = ${props.convertValue[0]}, userName='${props.convertValue[1]}', agency='${props.convertValue[2]}', catalog='${props.convertValue[3]}', cat_no='${props.convertValue[4]}', unit='${props.convertValue[5]}', January=${props.convertValue[6]},February=${props.convertValue[7]},March=${props.convertValue[8]},Aprill=${props.convertValue[9]},May=${props.convertValue[10]},June=${props.convertValue[11]},July=${props.convertValue[12]},August=${props.convertValue[13]},September=${props.convertValue[14]},October=${props.convertValue[15]},November=${props.convertValue[16]},December=${props.convertValue[17]}, InsertDate='${props.convertValue[18]}'
  `;
    connection.query(query, [props.convertValue], (error, rows, fields) => {
      if (error) {
        return console.info(error);
      }
    })
  })

  return res.json([{ data: 'upload success' }]);
})

module.exports = router;
