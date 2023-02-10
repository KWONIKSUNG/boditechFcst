import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import styled from 'styled-components';
import { Button, Input } from '@mui/material';
import ResultTab from './ResultTab';
import axios from 'axios';
import { useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function CompanyModal({ setIsSearching, setDataArr, handleGetData, value, setValue }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [filteredData, setFilteredData] = useState([]);

  const getSearchData = async (agency) => {
    try {
      const result = await axios.get(`/api/filterUser?agency=${agency}`)
      setFilteredData(result.data[0].data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <InputFilter
        label="Company Name"
        value={value}
        readOnly={true}
        variant="outlined"
        onClick={handleOpen}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} display="flex" flexDirection="column">
          <ModalTitleWrapper>
            <ModalTitle>Company Search</ModalTitle>
            <Button variant='contained' onClick={() => {
              if (value === '' || value === null || value === undefined) return;
              getSearchData(value);
              setIsSearching(true);
            }}>Search</Button>
          </ModalTitleWrapper>
          <Input placeholder='Enter the name of the company you want to find.' value={value} onChange={(e) => setValue(e.target.value)} />
          <ResultTab setDataArr={setDataArr} userData={filteredData} coName={value} setCoName={setValue} handleGetData={handleGetData} handleClose={handleClose} />
        </Box>
      </Modal>
    </div>
  );
}

const ModalTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 3rem;
`

const ModalTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 900;
  color: #3f51b5;
`

const InputFilter = styled(Input)`
  width: 20rem;
`