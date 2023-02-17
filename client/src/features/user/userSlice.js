import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  id: '',
  agency: '',
  loginStatus: 'idle'
}

export const login = createAsyncThunk('user/login', async (userInfo) => {
  const response = await axios.post(`/api/login?id=${userInfo.id}&password=${userInfo.password}`)
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
        const { id, agency } = action.payload
        state.agency = agency
        state.id = id
        state.loginStatus = 'success'
      })
      .addCase(login.pending, (state, action) => {
        state.loginStatus = 'loading'
      }).addCase(logout.fulfilled, (state, action) => {
        state.loginStatus = 'idle'
      })
  }
})

export const statusSelector = state => state.user.loginStatus
export const agencySelector = state => state.user.agency
export default userSlice.reducer