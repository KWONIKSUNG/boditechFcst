import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  id: '',
  agency: '',
  loginStatus: 'idle'
}

export const login = createAsyncThunk('user/login', async (userInfo) => {
  const { id, password } = userInfo
  const response = await axios.post(`/api/login?id=${id}&password=${password}`)
  return response.data
})

export const logout = createAsyncThunk('user/logout', async () => {
  const response = await axios.get(`/api/logout`)
  return response.data
})

export const changePassword = createAsyncThunk('user/changePw', async (changeInfo) => {
  const { userId, password, confirmPassword } = changeInfo
  if (password === confirmPassword) {
    const result = await axios.get(`/api/change?id=${userId}&password=${password}`);
    if (result.data) {
      alert(result.data);
    }
  } else {
    alert('Passwords do not match')
  }
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(login.fulfilled, (state, action) => {
        console.log(action.payload)
        const { id, agency } = action.payload
        state.agency = agency
        state.id = id
        state.loginStatus = 'success'
      })
      .addCase(login.pending, (state, action) => {
        state.loginStatus = 'loading'
      }).addCase(logout.fulfilled, (state, action) => {
        state.loginStatus = 'idle'
      }).addCase(login.rejected, (state, action) => {
        state.loginStatus = 'idle'
        alert('Check your id or password')
      }).addCase(logout.pending, (state, action) => {
        state.loginStatus = 'loading'
      })
  }
})

export const statusSelector = state => state.user.loginStatus
export const agencySelector = state => state.user.agency
export default userSlice.reducer