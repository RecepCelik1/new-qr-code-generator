import { configureStore } from '@reduxjs/toolkit'
import  qrCodeContent  from './qrCodePopUpContent'

export const store = configureStore({
  reducer: {
    qrCodePopUp : qrCodeContent
  },
})