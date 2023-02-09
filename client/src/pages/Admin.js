import styled from "styled-components";
import Spreadsheet from "react-spreadsheet";
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { TitleLabel } from "../components/Rows";
import axios from "axios";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Button, IconButton } from "@mui/material";
import CompanyModal from "../components/CompanyModal";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { handleGetCurrent, handleGetAdmin, handleGetAdminData } from "../utils/SheetUtils";
import { Stack } from "@mui/system";


const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dataArr, setDataArr] = useState([]);
  const [agencyName, setAgencyName] = useState('');
  const [offset, setOffset] = useState(0);
  const [pagingList, setPagingList] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (location.state === null || location.state === undefined || !location.state) {
      return navigate('/');
    }
    axios.get(`/api/userId?userId=${location.state}`)
      .then(async (res) => {
        setAgencyName(res.data.data);
        handleGetAdminData(setDataArr, res.data.data, offset, setPagingList);
      }).catch(err => {
        console.error(err);
      })

  }, [offset])

  const handleLogout = () => {
    axios.get(`/api/logout`)
      .then(res => {
        navigate('/');
      })
      .catch(err => console.error(err))
  }


  const clearInput = () => {
    setValue(prev => prev = '');
  }
  return (
    <AppWrapper>
      <Box position="absolute" top="0" left="0" width="30vw" height="30vh">
        <List>
          <ListItem>
            <ListItemIcon>
              <FiberManualRecordIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="This is the administrator page." />
          </ListItem>
        </List>
      </Box>
      <BtnContainer>
        <BtnWrapper onClick={() => {
          clearInput();
          handleGetAdmin(setDataArr, offset, setPagingList, setIsSearching);
        }} variant="contained">
          FCST lookup
        </BtnWrapper>
      </BtnContainer>
      <TableWrapper>
        <TitleLayout>
          <TitleWrapper>
            <FileTitle>
              <h2>{agencyName}</h2>
              <BtnWrapper variant="outlined" onClick={handleLogout}>Logout</BtnWrapper>
            </FileTitle>
          </TitleWrapper>
          <FilterWrapper>
            <FileTitle>Filter</FileTitle>
            <CompanyModal value={value} setValue={setValue} setIsSearching={setIsSearching} handleGetData={handleGetCurrent} setDataArr={setDataArr} agencyName={agencyName} />
          </FilterWrapper>
          {!isSearching && <PagingWrapper>
            <Paging>{offset >= pagingList ? offset - 30 : offset} - {offset + 30 > pagingList ? pagingList : offset + 30} of {pagingList}</Paging>
            <IconButton onClick={() => setOffset(prev => {
              if (prev - 30 <= 0) return prev = 0;
              else return prev - 30;
            })}>
              <ArrowBackIosIcon />
            </IconButton>
            <Stack direction="row" spacing={1}>
              <IconBtn onClick={() => setOffset(prev => {
                if (prev + 30 >= pagingList) return prev;
                else return prev + 30;
              })}>
                <ArrowForwardIosIcon />
              </IconBtn>
            </Stack>
          </PagingWrapper>}
        </TitleLayout>
        <SpreadsheetWrapper columnLabels={TitleLabel} data={dataArr} onChange={setDataArr} />
      </TableWrapper>
    </AppWrapper>
  );
}

export default Admin;

const FilterWrapper = styled.div`
  display: flex;
  align-items:center;
  margin-right: 2rem;
`

const IconBtn = styled(IconButton)`
  display: flex !important;
  align-items: center !important;
  justify-content:center !important;
`

const PagingWrapper = styled.div`
  display:flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  width: 20rem;
  padding-top: 0.5rem;
  font-weight: 600;
  margin-right: 1rem;
`

const Paging = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 7rem;
  height: 20px;
`

const AppWrapper = styled.div`
  position:relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100vw;
  height: 100vh;
`
const BtnWrapper = styled(Button)`
  width: 10rem;
  margin-right: 1rem !important;
  margin-left: 1rem !important;
`

const TableWrapper = styled.div`
  display: flex;
  align-items:flex-start;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  max-height: 100vh;
  overflow:scroll;
  
  *{
    color: darkslategray !important;
  }
`

const SpreadsheetWrapper = styled(Spreadsheet)`
  margin: 0 !important;
  max-height:58vh;
`

const FileTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 600;
  margin:1rem 0.5rem 1rem 1rem;
`

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`

const BtnContainer = styled.div`
  position: absolute;
  top:0;
  right:0;
  display: flex;
  justify-content:flex-end;
  width: 100%;
  margin-top: 1rem;
`

const TitleLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5rem;
  width: 100%;
`