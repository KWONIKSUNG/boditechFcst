import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { arrayToSheetObj } from "../../api/sheetControler";

export const getStandardData = createAsyncThunk('sheet/getStandardData', async (id) => {
  try {
    const result = await axios.get(`/api/excel?id=${id}`)
    const wrappedResult = arrayToSheetObj(result.data)
    return wrappedResult
  } catch (err) {
    throw new Error('unexpected error : ', err)
  }
})

export const getCurrentData = createAsyncThunk('sheet/getCurrentData', async (agency) => {
  try {
    const result = await axios.get(`/api/currentdata?agency=${agency}`)
    const wrappedResult = arrayToSheetObj(result.data)
    return wrappedResult
  } catch (err) {
    throw new Error('unexpected error : ', err)
  }
})

export const postSheet = createAsyncThunk('sheet/postSheet', async (args, { getState }) => {
  const sheetState = getState()
  const nullCheckArr = sheetState.sheet.sheetData.map((innerArr) => {
    return innerArr.map((props) => {
      if (props.value === null) {
        return 0;
      } else {
        return props.value;
      }
    });
  });
  const postSheetState = nullCheckArr.filter((props) => {
    return (props.reduce((cnt, elem) =>
      cnt + (elem === undefined || elem === null || elem === 0), 0) < 14);
  })
  try {
    const result = await axios.post(`/api/excel`, {
      data: {
        form: postSheetState
      }
    })
    alert(result.data);
  } catch (err) {
    throw new Error('unexpected error : ', err)
  };
})

export const getAdminData = createAsyncThunk('sheet/getAdminData', async (offset) => {
  try {
    const result = await axios.get(`/api/adminGet?offset=${offset}`)
    return result.data;
    //TODO: store = newResData
  } catch (err) {
    console.error(err);
  }
})

const sheetSlice = createSlice({
  name: 'sheet',
  initialState: {
    sheetData: [],
    sheetStatus: 'idle',
    sheetPageNum: 0,
  },
  reducers: {
    changeXlsxData(state, action) {
      action.payload.shift()
      state.sheetData = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getStandardData.fulfilled, (state, action) => {
        state.sheetData = action.payload
      })
      .addCase(getCurrentData.fulfilled, (state, action) => {
        state.sheetData = action.payload
      })
      .addCase(getCurrentData.rejected, (state, action) => {
        state.sheetData = []
      })
      .addCase(getAdminData.fulfilled, (state, action) => {
        const { data, pageNum } = action.payload
        state.sheetData = arrayToSheetObj(data)
        state.sheetPageNum = pageNum[0]['FOUND_ROWS()']
      })
  }
})

export default sheetSlice.reducer
export const { changeXlsxData } = sheetSlice.actions
export const selectSheetData = state => state.sheet.sheetData