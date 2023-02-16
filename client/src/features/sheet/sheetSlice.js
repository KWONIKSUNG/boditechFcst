import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  sheet: [],
  pageNum: 0,
}

export const getSheet = createAsyncThunk('sheet/getSheet', async (id) => {
  const res = await axios.get(`/api/excel?name=${id}`)
  return res.data
})

export const sheetSlice = createSlice({
  name: 'sheet',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getSheet.fulfilled, (state, action) => {
      state.sheet.push(action.payload)
    })
  }
})

export const sheetSelector = state => state.sheet
export default sheetSlice.reducer