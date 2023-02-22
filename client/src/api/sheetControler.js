import * as xlsx from 'xlsx';
import { columnName } from '../mocks/Rows';

const excelDownload = (excel, agencyName) => {
  let index = 1;
  const file = excel.map(rows => {
    const convertedRows = rows.map((rowData) => {
      if (rowData.value === null || rowData.value === undefined) {
        return null;
      } else {
        return rowData.value;
      }
    });
    convertedRows.unshift(index);
    index++;
    return convertedRows;
  });
  file.unshift(columnName);
  const book = xlsx.utils.book_new();
  const dataSheet = xlsx.utils.json_to_sheet(file, { skipHeader: true });
  xlsx.utils.book_append_sheet(book, dataSheet, "data");
  xlsx.writeFile(book, `fcst-${agencyName}-data.xlsx`);
}

const arrayToSheetObj = (resArr) => {
  const resultArr = resArr.map(props => {
    const result = [];
    for (let keys in props) {
      result.push({ value: props[keys], readOnly: true })
    }
    return result;
  })
  return resultArr;
}

export { excelDownload, arrayToSheetObj }