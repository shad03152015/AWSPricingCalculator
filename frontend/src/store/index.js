import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import calculatorReducer from './slices/calculatorSlice';
import estimatesReducer from './slices/estimatesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    calculator: calculatorReducer,
    estimates: estimatesReducer,
  },
});

export default store;
