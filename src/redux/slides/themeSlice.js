import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    thame: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    saveTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { thame, saveTheme } = themeSlice.actions;

export default themeSlice.reducer;
