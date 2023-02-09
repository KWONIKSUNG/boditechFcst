import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CompanyNameList from './CompanyNameList';


export default function ResultTab({ agencyName, coName, userData, setCoName, handleGetData, handleClose, setDataArr, offset, pagingList }) {

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={0}>
          <Tab label="Search Result" />
        </Tabs>
      </Box>
      <CompanyNameList agencyName={agencyName} setDataArr={setDataArr} coName={coName} userData={userData} setCoName={setCoName} handleGetData={handleGetData} handleClose={handleClose} offset={offset} pagingList={pagingList} />
    </Box>
  );
}