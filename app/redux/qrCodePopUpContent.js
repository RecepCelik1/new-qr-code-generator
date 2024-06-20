import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isPopUpvisible : false,
    qrCodeData : null,
}

export const qrCodeContent = createSlice({
  name: 'qrCodeContent',
  initialState,
  reducers: {
    setPopUpVisible (state) {
      state.isPopUpvisible = !state.isPopUpvisible;
    },
    setQrCodeData (state,action) {
      state.qrCodeData = action.payload;
    }
  },
})

export const { setPopUpVisible , setQrCodeData } = qrCodeContent.actions

export default qrCodeContent.reducer