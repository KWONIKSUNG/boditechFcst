import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  id: '',
  password: '',
  agency: '',
  loginStatus: 'idle'
}

export const fetchUser = createAsyncThunk('user/fetchUser', async (id) => {
  const response = await axios.get(`/api/userId?userId=${id}`)
  return response.data.data
})

export const logout = createAsyncThunk('user/logout', async () => {
  const response = await axios.get(`/api/logout`)
  return response.data
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      const { id, password } = action.payload
      state.id = id
      state.password = password
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        console.log('action payload : ', action.payload)
        const { USERID, USERPW, agency } = action.payload
        if (state.id === USERID && state.password === USERPW) {
          state.agency = agency
          state.loginStatus = 'success'
        } else {
          state.loginStatus = 'invaild'
        }
      })
      .addCase(fetchUser.pending, (state, action) => {
        state.loginStatus = 'loading'
      })
  }
})

export const { login } = userSlice.actions
export const statusSelector = state => state.user.loginStatus
export const agencySelector = state => state.user.agency
export default userSlice.reducer