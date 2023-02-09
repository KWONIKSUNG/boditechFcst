import styled from "styled-components";
import readXlsxFile from 'read-excel-file';
import Spreadsheet from "react-spreadsheet";
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { TitleLabel } from "../components/Rows";
import * as xlsx from 'xlsx';
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
import { handleSubmit, handleGetData, defaultCellChecker, handleOnClick, handleGetCurrent, handleGetAdmin } from "../utils/SheetUtils";
import { Stack } from "@mui/system";


const Sheet = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dataArr, setDataArr] = useState([]);
  const ref = useRef();
  const [isAdmin, setIsAdmin] = useState(false);
  const [agencyName, setAgencyName] = useState('');
  const [offset, setOffset] = useState(0);
  const [pagingList, setPagingList] = useState(0);

  useEffect(() => {
    if (location.state === null || location.state === undefined || !location.state) {
      return navigate('/');
    }
    axios.get(`/api/userId?userId=${location.state}`)
      .then(async (res) => {
        setAgencyName(res.data.data);
        if (res.data.data === 'admin') {
          setIsAdmin(true);
        }
        handleGetData(setDataArr, res.data.data, offset, setPagingList);
      }).catch(err => {
        console.error(err);
      })

    return () => {
      setIsAdmin(false);
    }
  }, [offset])

  const excelDownload = () => {
    const submitArr = dataArr.map(innerArr => {
      return innerArr.map((props) => {
        if (props.value === null || props.value === undefined) {
          return null;
        } else {
          return props.value;
        }
      });
    });
    submitArr.unshift(TitleLabel);
    const book = xlsx.utils.book_new();
    const dataSheet = xlsx.utils.json_to_sheet(submitArr, { skipHeader: true });
    xlsx.utils.book_append_sheet(book, dataSheet, "data");
    xlsx.writeFile(book, `fcst-${agencyName}-data.xlsx`);
  }

  const fileHandler = (event) => {
    const fileObj = event.target.files[0];
    if (fileObj.name.split('.')[1] === 'xls' || fileObj.name.split('.')[1] === 'xlsx') {
      readXlsxFile(fileObj).then(res => {
        res.forEach(props => {
          const dataObj = props.map(prop => {
            let newDataObj;
            if (prop === null) {
              newDataObj = { "value": '0', "readOnly": true };
            } else {
              newDataObj = { "value": prop, "readOnly": true };
            }
            return newDataObj;
          });
          setDataArr(prev => {
            return [...prev, dataObj];
          })
        })
        setDataArr(prev => {
          let newArr = [...prev];
          newArr.shift();
          return newArr;
        })
        defaultCellChecker(dataArr, setDataArr);
      }).catch(err => console.error(err));
    } else {
      alert('엑셀 파일만 업로드 가능합니다');
      event.target.value = '';
      return;
    }
  }

  const handleLogout = () => {
    axios.get(`/api/logout`)
      .then(res => {
        navigate('/');
      })
      .catch(err => console.error(err))
  }

  return (
    <AppWrapper>
      {!isAdmin ? (
        <Box position="absolute" top="0" left="0" width="30vw" height="30vh">
          <List>
            <ListItem>
              <ListItemIcon>
                <FiberManualRecordIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Click Download the file in the upper left and modify the Excel file." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <FiberManualRecordIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Click Choose File and upload modified file" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <FiberManualRecordIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Click Submit" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <FiberManualRecordIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Click the FCST lookup in the upper left to see if it has been applied." />
            </ListItem>
          </List>
        </Box>) : (
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
      )}
      <BtnContainer>
        {!isAdmin &&
          <BtnWrapper onClick={excelDownload} variant="contained">
            Download to Excel
          </BtnWrapper>}
        {(!isAdmin &&
          <BtnWrapper variant="contained" onClick={() => handleOnClick(setDataArr, ref)}>
            <input type='file' ref={ref} style={{ display: "none" }} onChange={fileHandler} />
            Choose File
          </BtnWrapper>
        )}

        {!isAdmin && (
          <BtnWrapper variant="contained" onClick={() => handleSubmit(dataArr, location.state)}>
            Submit
          </BtnWrapper>
        )}
        <BtnWrapper onClick={isAdmin ? () => handleGetAdmin(setDataArr, agencyName, offset, setPagingList) : () => handleGetCurrent(setDataArr, agencyName, offset, setPagingList)} variant="contained">
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
          {isAdmin && (
            <FilterWrapper>
              <FileTitle>Filter</FileTitle>
              <CompanyModal handleGetData={handleGetCurrent} setDataArr={setDataArr} agencyName={agencyName} />
            </FilterWrapper>
          )}
          <PagingWrapper>
            <Paging>{offset} - {offset + 30 > pagingList ? pagingList : offset + 30} of {pagingList}</Paging>
            <IconButton onClick={() => setOffset(prev => {
              if (prev - 30 <= 0) return prev = 0;
              else return prev - 30;
            })}>
              <ArrowBackIosIcon />
            </IconButton>
            <Stack direction="row" spacing={1}>
              <IconBtn onClick={() => setOffset(prev => {
                if (prev + 30 > pagingList - 1) return prev = pagingList - 1;
                else return prev + 30;
              })}>
                <ArrowForwardIosIcon />
              </IconBtn>
            </Stack>
          </PagingWrapper>
        </TitleLayout>
        <SpreadsheetWrapper columnLabels={TitleLabel} data={dataArr} onChange={setDataArr} />
      </TableWrapper>
    </AppWrapper>
  );
}

export default Sheet;
const FilterWrapper = styled.div`
  display: flex;
  align-items:center;
  width: 50%;
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

const ListWrapper = styled.div`
  width: 15rem;
  height: 100vh;
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
  justify-content: center;
  height: 5rem;
  width: 100%;
`