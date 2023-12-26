// `createAsyncThunk` facilite la gestion des actions asynchrones, et `createSlice` rationalise la gestion de l'état dans Redux.
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetErrorAction } from "../globalActions/globalAction";
import baseURL from "../../../utils/baseURL";

// initial state
const initialState = {
  loading: false,
  error: null,
  users: [],
  user: {},
  profile: {},
  userAuth: {
    loading: false,
    error: null,
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
};

// register action
export const registerUserAction = createAsyncThunk(
  "users/register",
  async (
    { fullname, email, password },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      // make the http request
      const { data } = await axios.post(`${baseURL}/users/register`, {
        fullname,
        email,
        password,
      });

      return data;
    } catch (error) {
      console.log(error.response.data.message);
      // get the error message from the backend thanks to rejectWithValue
      return rejectWithValue(error?.response?.data);
    }
  }
);

// login action
export const loginUserAction = createAsyncThunk(
  "users/login",
  async ({ email, password }, { rejectWithValue, getState, dispatch }) => {
    try {
      // make the http request
      const { data } = await axios.post(`${baseURL}/users/login`, {
        email,
        password,
      });
      // save user to local storage
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      console.log(error);
      // get the error message from the backend thanks to rejectWithValue
      return rejectWithValue(error?.response?.data);
    }
  }
);

// users slice
const usersSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    // handle actions
    // login
    builder.addCase(loginUserAction.pending, (state, action) => {
      state.userAuth.loading = true;
    });

    // authenticated
    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      state.userAuth.userInfo = action.payload;
      state.userAuth.loading = false;
    });

    // unauthenticated
    builder.addCase(loginUserAction.rejected, (state, action) => {
      state.userAuth.error = action.payload;
      state.userAuth.loading = false;
    });

    // register
    builder.addCase(registerUserAction.pending, (state, action) => {
      state.loading = true;
    });

    // registered
    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });

    // non registered
    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    // reset error action
    builder.addCase(resetErrorAction.pending, (state) => {
      state.error = null;
    });
  },
});

// generate the reducer
const usersReducer = usersSlice.reducer;

export default usersReducer;
