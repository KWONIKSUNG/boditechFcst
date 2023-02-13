const express = require('express');
const { connection } = require('../sql_server/server');
const { SHEET_NAME, GET_SHEET_NAME } = require('../common/var');

const router = express.Router();

router.get('/', async (req, res) => {
  let data;

  connection.query(`
        select
          SQL_CALC_FOUND_ROWS Year, Name, Company, Catalog, Cat_no, Unit, January,February,March,Aprill,May,June,July,August,September,October,November,December
        from
          ${GET_SHEET_NAME}
        where 
          Company='${req.query.agency}'
  `, (error, rows, filelds) => {
    data = rows;
  })

  connection.query(`
        SELECT FOUND_ROWS();
  `, (error, rows, filelds) => {
    res.json([{ data: data, pageNum: rows }]);
  })
})

router.post('/', async (req, res) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const newArr = req.body.data.form;
  const arrToSql = [];
  let isError = false;
  for (let i = 0; i < newArr.length; i++) {
    let cat_no = newArr[i][4];
    let agency = newArr[i][2];
    let UpdateDate = newArr[i][0];
    const param = newArr[i];
    const zeroCount = param.filter(elem => elem === 0 || elem === '0').length;
    if (zeroCount > 13) continue;
    param.push(`${year}-${month}-${day}`);
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
    insert into ${SHEET_NAME} values (?) on duplicate key update Year = ${props.convertValue[0]}, Name='${props.convertValue[1]}', Company='${props.convertValue[2]}', Catalog='${props.convertValue[3]}', Cat_no='${props.convertValue[4]}', Unit='${props.convertValue[5]}', January=${props.convertValue[6]},February=${props.convertValue[7]},March=${props.convertValue[8]},Aprill=${props.convertValue[9]},May=${props.convertValue[10]},June=${props.convertValue[11]},July=${props.convertValue[12]},August=${props.convertValue[13]},September=${props.convertValue[14]},October=${props.convertValue[15]},November=${props.convertValue[16]},December=${props.convertValue[17]}, InsertDate='${props.convertValue[18]};'
  `;
    connection.query(query, [props.convertValue], (error, rows, fields) => {
      if (error) {
        isError = true;
        connection.rollback();
      }
    })
  })

  setTimeout(() => {
    if (isError) {
      res.send([{ data: 'Error Occurred! Please check the data type ' }]);
      return;
    } else {
      res.send([{ data: 'upload success' }]);
      return;
    }
  }, 500)
})

module.exports = router;
