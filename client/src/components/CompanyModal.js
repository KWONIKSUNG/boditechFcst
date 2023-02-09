import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import styled from 'styled-components';
import { Button, IconButton, Input, Stack } from '@mui/material';
import ResultTab from './ResultTab';
import axios from 'axios';
import { useState, useEffect } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


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

export default function CompanyModal({ setDataArr, handleGetData, agencyName }) {
  const [open, setOpen] = useState(false);
  const [coName, setCoName] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [userData, setUserData] = useState([]);
  const [pagingList, setPagingList] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [offset, setOffset] = useState(0);


  useEffect(() => {
    axios.get(`/api/getUser?offset=${offset}`).then(res => {
      setUserData(res.data[0].data);
      setPagingList(res.data[0].pageNum[0]['FOUND_ROWS()']);
      setFilteredData(res.data[0].data);
    }).catch((err) => {
      console.error(err);
    })
  }, [offset])

  const handleChangeFilter = (value) => {
    setCoName(value);
    setFilteredData(userData.filter(data => {
      return data.agency.toLowerCase().includes(value.toLowerCase());
    }))
  }

  return (
    <div>
      <InputFilter
        label="Company Name"
        value={coName}
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
            <PagingWrapper>
              <Paging>{offset} - {offset + 100 > pagingList ? pagingList : offset + 100} of {pagingList}</Paging>
              <IconButton onClick={() => setOffset(prev => {
                if (prev - 100 <= 0) return prev = 0;
                else return prev - 100;
              })}>
                <ArrowBackIosIcon />
              </IconButton>
              <Stack direction="row" spacing={1}>
                <IconBtn onClick={() => setOffset(prev => {
                  if (prev + 100 > pagingList - 1) return prev = pagingList - 1;
                  else return prev + 100;
                })}>
                  <ArrowForwardIosIcon />
                </IconBtn>
              </Stack>
            </PagingWrapper>
            {/* <Button variant='contained' onClick={() => SearchBtnClick(offset)}>Search</Button> */}
          </ModalTitleWrapper>
          <Input placeholder='Enter the name of the company you want to find.' value={coName} onChange={(e) => handleChangeFilter(e.target.value)} />
          <ResultTab agencyName={agencyName} setDataArr={setDataArr} userData={filteredData} coName={coName} setCoName={setCoName} handleGetData={handleGetData} handleClose={handleClose} offset={offset} pagingList={setPagingList} />
        </Box>
      </Modal>
    </div>
  );
}

const IconBtn = styled(IconButton)`
  display: flex !important;
  align-items: center !important;
  justify-content:center !important;
`

const Paging = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 7rem;
`

const PagingWrapper = styled.div`
  display:flex;
  align-items: center;
  justify-content: space-around;
  width: 20rem;
  padding-top: 0.5rem;
  font-weight: 600;
  margin-right: 1rem;
`



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