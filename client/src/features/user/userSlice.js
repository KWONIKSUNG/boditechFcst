import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { redirect } from "react-router-dom";

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
      }).addCase(logout.pending, (state, action) => {
        state.loginStatus = 'loading'
      })
  }
})

export const statusSelector = state => state.user.loginStatus
export const agencySelector = state => state.user.agency
export default userSlice.reducer