import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import styled from 'styled-components';
import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function ChangePw() {
  const userId = useSelector(state => state.user.id)
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  }

  const handleChangeBtn = async () => {
    if (password === confirmPassword) {
      const result = await axios.get(`/api/change?id=${userId}&password=${password}`);
      if (result.data) {
        alert(result.data);
        setOpen(false);
        setPassword('');
        setConfirmPassword('');
      }
    } else {
      alert('Passwords do not match')
    }
  }

  return (
    <div>
      <Button onClick={handleOpen} variant="outlined" style={{ marginLeft: '1rem' }}>Change Password</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600 }}>Change Password</h2>
          <InputWrapper>
            <TextField value={password} style={{ height: '4rem' }} label="Password" type='password' variant="outlined" name="password" onChange={handlePassword} />
            <TextField value={confirmPassword} style={{ height: '4rem' }} type="Password" label="Confirm Password" variant="outlined" name="confirm password" onChange={handleConfirmPassword} />
            <Button style={{ width: '13rem' }} variant='contained' onClick={handleChangeBtn}>Change</Button>
          </InputWrapper>
        </Box>
      </Modal>
    </div>
  );
}

const InputWrapper = styled.div`
  display:flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 15rem;
`