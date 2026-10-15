import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios.js";

// 1. Register Async Thunk
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post("/register", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    }
  }
);

// 2. Login Async Thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post("/login", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid email or password."
      );
    }
  }
);

// 3. Fetch Session (getMe) Async Thunk
export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/me");
      return response.data;
    } catch (error) {
      return rejectWithValue("Session expired or unauthenticated");
    }
  }
);

// 4. Logout Async Thunk
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await API.post("/logout");
  } catch (error) {
    console.error("Logout error:", error);
  }
  return null;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
    isInitialized: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // GetMe
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isInitialized = true;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;