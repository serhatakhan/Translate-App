import { createSlice } from "@reduxjs/toolkit";
import { translateText } from "../actions/translateActions";

const initialState = {
  isLoading: false,
  isError: false,
  text: "",
};
// text: "" yaptık çünkü gelen ifade metin. dizi falan değil.

const translateSlice = createSlice({
  name: "translate",
  initialState,
  // senkron aksiyonları tanımladık
  reducers: {
    // payload değerini text'e aktar(değiştir'e tıklayınca çevrilen metin için.)
    updateText: (state, action)=>{
      state.text = action.payload
    }
  },
  // asenkron aksiyonları tanımladık
  extraReducers: (builder)=>{
    builder.addCase(translateText.pending, (state)=>{
      state.isLoading = true
    })

    builder.addCase(translateText.rejected, (state, action)=>{
      state.isError = action.error
      state.isLoading = false
    })
    
    builder.addCase(translateText.fulfilled, (state, action)=>{
      state.isLoading = false
      state.isError = false
      state.text = action.payload
    })
  },
});

export default translateSlice.reducer

export const {updateText} = translateSlice.actions