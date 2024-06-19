import { createSlice, configureStore } from '@reduxjs/toolkit';

const formSlice = createSlice({
  name: 'form',
  initialState: { formId: 'Login' },
  reducers: {
    showLogin(state, action) {
      state.formId = action.payload;
    },
    showSignup(state, action) {
      state.formId = action.payload;
    },
  },
});

export const formActions = formSlice.actions;

const mobileNavSlice = createSlice({
  name: 'mobile-nav',
  initialState: { isOpen: false },
  reducers: {
    toggleMenu(state) {
      state.isOpen = !state.isOpen;
    },
  },
});

export const menuActions = mobileNavSlice.actions;

const modalIdSlice = createSlice({
  name: 'modalId',
  initialState: { modalId: '' },
  reducers: {
    setModalId(state, action) {
      state.modalId = action.payload;
    },
  },
});

export const modalIdActions = modalIdSlice.actions;

const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuth: false, userId: null },
  reducers: {
    login(state) {
      state.isAuth = true;
    },
    logout(state) {
      state.isAuth = false;
    },
  },
});

export const authActions = authSlice.actions;

const itemSlice = createSlice({
  name: 'item',
  initialState: { itemId: '', isChecked: false },
  reducers: {
    toggleChecked(state, action) {
      state.isChecked = !state.isChecked;
      state.itemId = action.payload;
    },
  },
});

export const itemActions = itemSlice.actions;

// const listSlice = createSlice({
//   name: 'list',
//   initialState: [{ itemId: '', isChecked: false }],
//   reducers: {
//     reorderList(state, action) {
//       state = action.payload;
//     },
//     toggleChecked(state, action) {
//       state.isChecked = !state.isChecked;
//       state.itemId = action.payload;
//     },
//   },
// });

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

const editingSlice = createSlice({
  name: 'edit',
  initialState: { isEditing: false },
  reducers: {
    setIsEditing(state, action) {
      state.isEditing = action.payload;
    },
  },
});

export const editingActions = editingSlice.actions;

export const store = configureStore({
  reducer: {
    // form: formSlice.reducer,
    // menu: mobileNavSlice.reducer,
    // modalId: modalIdSlice.reducer,
    // auth: authSlice.reducer,
    // item: itemSlice.reducer,
    loading: loadingSlice.reducer,
    editing: editingSlice.reducer,
  },
});
