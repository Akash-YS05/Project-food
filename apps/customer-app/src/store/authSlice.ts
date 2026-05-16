import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@bambam/shared';
import { authApi } from '../api/services';
import { setAuthToken } from '../api/client';
import { storage } from '../utils/storage';

interface AuthState {
  token?: string;
  user?: UserProfile;
  status: 'idle' | 'loading' | 'authenticated' | 'error';
  error?: string;
}

const initialState: AuthState = {
  status: 'idle'
};

export const loginCustomer = createAsyncThunk('auth/loginCustomer', async (payload: { identifier: string; password: string }) => {
  const response = await authApi.login(payload.identifier, payload.password);
  return response.data;
});

export const signupCustomer = createAsyncThunk(
  'auth/signupCustomer',
  async (payload: { fullName: string; email: string; phone: string; password: string }) => {
    const response = await authApi.signup(payload);
    return response.data;
  }
);

export const loginWithOtp = createAsyncThunk('auth/loginWithOtp', async (payload: { phone: string; fullName?: string }) => {
  const response = await authApi.otp(payload.phone, payload.fullName);
  return response.data;
});

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (payload: { email: string; fullName: string; googleId: string }) => {
    const response = await authApi.google(payload);
    return response.data;
  }
);

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async () => {
  const token = await storage.getToken();
  if (!token) {
    return null;
  }
  setAuthToken(token);
  const response = await authApi.me();
  return { token, user: response.data.user };
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = undefined;
      state.user = undefined;
      state.status = 'idle';
      state.error = undefined;
      setAuthToken(undefined);
      void storage.clearToken();
    },
    hydrateAuth(state, action: PayloadAction<{ token: string; user: UserProfile }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.status = 'authenticated';
    }
  },
  extraReducers: (builder) => {
    const fulfilled = (state: AuthState, action: PayloadAction<{ accessToken?: string; token?: string; user: UserProfile }>) => {
      const token = action.payload.accessToken ?? action.payload.token ?? state.token;
      state.token = token;
      state.user = action.payload.user;
      state.status = 'authenticated';
      state.error = undefined;
      if (token) {
        setAuthToken(token);
        void storage.setToken(token);
      }
    };

    builder
      .addCase(loginCustomer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginCustomer.fulfilled, fulfilled)
      .addCase(signupCustomer.fulfilled, fulfilled)
      .addCase(loginWithOtp.fulfilled, fulfilled)
      .addCase(loginWithGoogle.fulfilled, fulfilled)
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        if (!action.payload) {
          state.status = 'idle';
          return;
        }
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.status = 'authenticated';
      })
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
        (state, action: PayloadAction<unknown, string, unknown, Error>) => {
          state.status = 'error';
          state.error = action.error.message;
        }
      );
  }
});

export const { logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
