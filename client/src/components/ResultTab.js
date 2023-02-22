import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CompanyNameList from './CompanyNameList';


export default function ResultTab({ userData, setValue, handleClose }) {

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={0}>
          <Tab label="Search Result" />
        </Tabs>
      </Box>
      <CompanyNameList userData={userData} setCoName={setValue} handleClose={handleClose} />
    </Box>
  );
}