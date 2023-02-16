import { configureStore } from "@reduxjs/toolkit";
import sheetReducer from '../features/sheet/sheetSlice'
import userReducer from '../features/user/userSlice'

export default configureStore({
  reducer: {
    sheet: sheetReducer,
    user: userReducer
  }
})