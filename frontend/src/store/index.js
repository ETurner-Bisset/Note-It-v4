import { createSlice, configureStore } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: { isLoading: false },
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const loadingActions = loadingSlice.actions;

export const store = configureStore({
  reducer: {
    loading: loadingSlice.reducer,
  },
});
