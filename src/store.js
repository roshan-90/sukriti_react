// store.js
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  // Add any other configuration options for redux-persist as needed
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  // Add any other configuration options for your store
});

const persistor = persistStore(store);

export { store, persistor };
