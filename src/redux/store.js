import { configureStore, combineReducers } from "@reduxjs/toolkit"; // 👈 Import combineReducers
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./authSlice";

// 1. Combine all slice reducers into a root reducer
const rootReducer = combineReducers({
  auth: authReducer,
});

// 2. Define the persistence configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

// 4. Wrap the rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  // 5. Use the persisted root reducer
  reducer: persistedReducer,
  // 6. Recommended middleware configuration for redux-persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/REGISTER"],
      },
    }),
});

export const persistor = persistStore(store);
