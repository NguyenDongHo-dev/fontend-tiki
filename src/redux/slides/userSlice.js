import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  access_token: "",
  phone: "",
  address: "",
  id: "",
  isAdmin: false,
  refreshToken:'',
};

export const userSlide = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserRD: (state, action) => {
      const {
        name = "",
        email,
        access_token,
        phone = "",
        address = "",
        _id = "",
        isAdmin,
        refreshToken,
      } = action.payload;
      state.id = _id;
      state.name = name;
      state.email = email;
      state.phone = phone;
      state.address = address;
      state.access_token = access_token;
      state.isAdmin = isAdmin;
      state.refreshToken = refreshToken
    },
    resetUser: (state) => {
      state.name = "";
      state.email = "";
      state.phone = "";
      state.address = "";
      state.access_token = "";
      state.id = "";
      state.isAdmin = false;
      state.refreshToken = ""
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUserRD, resetUser } = userSlide.actions;

export default userSlide.reducer;
