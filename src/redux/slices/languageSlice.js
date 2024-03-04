import { createSlice } from "@reduxjs/toolkit";
import { getLanguages } from "../actions/translateActions";
// aksiyonu import ettik önce. sonra extraReducer'da kullancağız

const initialState = {
  isLoading: false,
  isError: false,
  languages: [],
};
// api'den veri gelene kadar languages boş dizi [] olarak kaldın diyoruz

const languageSlice = createSlice({
  name: "language",
  initialState,
  extraReducers: (builder)=>{
    builder.addCase(getLanguages.pending, (state)=>{
        state.isLoading = true
    })
    builder.addCase(getLanguages.fulfilled, (state, action)=>{
        state.isError = false
        state.isLoading = false
        state.languages = action.payload
    })
    builder.addCase(getLanguages.rejected, (state, action)=>{
        state.isLoading = false
        state.isError = action.error
    })
  },
});
// api isteğinin sonuçlarını store'da tutmuş oluyoruz

export default languageSlice.reducer