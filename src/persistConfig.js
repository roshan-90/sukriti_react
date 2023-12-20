// persistConfig.js
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authentication"], // Reducer(s) to persist
};

export default (reducer) => persistReducer(persistConfig, reducer);
