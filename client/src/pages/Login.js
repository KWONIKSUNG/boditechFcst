import styled from "styled-components";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import { statusSelector, login } from "../features/user/userSlice";
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const status = useSelector(statusSelector)
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [userInfo, setUserInfo] = useState({
    id: '',
    password: ''
  })

  const handleInput = e => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    })
  }

  const onClickSignIn = () => {
    dispatch(login({ id: userInfo.id, password: userInfo.password })).then((res) => {
      if (res.payload.id === 'admin') {
        navigate('/Admin')
      } else {
        navigate('/Sheet')
      }
    })
  }

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', width: "100vw", height: "100vh", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    )
  }


  return (
    <LoginPageWrapper>
      <LogoImg src="/logo.png" alt="logo" onClick={() => navigate('/')} />
      <LoginBox isMobile={isMobile}>
        <InputWrapper>
          <LoginInput label="ID" variant="outlined" name="id" onChange={handleInput} />
          <LoginInput type="password" label="Password" variant="outlined" name="password" onChange={handleInput} />
        </InputWrapper>
        <BtnWrapper>
          <LoginButton variant="contained" color="info" onClick={onClickSignIn}>Sign in</LoginButton>
        </BtnWrapper>
      </LoginBox>
    </LoginPageWrapper>
  )
}

export default Login;

const LoginPageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content:center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`

const LogoImg = styled.img`
  margin-bottom: 2rem;
  cursor: pointer;
`

const LoginBox = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: ${props => props.isMobile ? '90vw' : '30%'};
  height: ${props => props.isMobile ? '17rem' : '40%'};
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`

const LoginButton = styled(Button)`
  width: 90%;
  height: 3rem;
  margin-bottom:0.5rem !important;
`

const BtnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`

const InputWrapper = styled.div`
  display: flex;
  align-items:center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`

const LoginInput = styled(TextField)`
  width: 90%;
  height: 3rem;
  margin-bottom:1rem !important;
`