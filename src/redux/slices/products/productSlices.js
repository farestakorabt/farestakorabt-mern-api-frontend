import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrorAction } from "../globalActions/globalAction";

// initialize state
const initialState = {
  products: [],
  product: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDeleted: false,
};

// create product action
export const createProductAction = createAsyncThunk(
  "product/create",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    console.log(payload);
    try {
      const {
        name,
        description,
        sizes,
        brand,
        colors,
        price,
        category,
        totalQty,
        files,
      } = payload;

      // make request

      // token -authentication token
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      // formData
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("brand", brand);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("totalQty", totalQty);

      sizes.foreach((size) => {
        formData.append("sizes", size);
      });

      colors.foreach((color) => {
        formData.append("colors", color);
      });

      files.foreach((file) => {
        formData.append("files", file);
      });

      // images
      const { data } = await axios.post(
        `${baseURL}/products`,
        {
          name,
          description,
          sizes,
          brand,
          colors,
          price,
        },
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// fetch product action
export const fetchProductAction = createAsyncThunk(
  "product/list",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    console.log(payload);
    try {
      // token -authentication token
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      // images
      const { data } = await axios.get(`${baseURL}/products`, config);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// slice
const productSlice = createSlice({
  name: "products",
  initialState,
  extraReducers: (builder) => {
    // create product
    builder.addCase(createProductAction.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(createProductAction.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
      state.isAdded = true;
    });

    // fetch all products
    builder.addCase(fetchProductAction.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchProductAction.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
      state.isAdded = true;
    });

    // reset success
    builder.addCase(resetErrorAction.pending, (state, action) => {
      state.error = null;
    });

    builder.addCase(createProductAction.rejected, (state, action) => {
      state.loading = false;
      state.products = null;
      state.isAdded = false;
      state.error = action.payload;
    });
  },
});

// generate the reducer
const productReducer = productSlice.reducer;

export default productReducer;
