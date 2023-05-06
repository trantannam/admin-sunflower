import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import storage from 'redux-persist/lib/storage';

import {
        userSigninReducer
} from "reducers/userReducers";
import {
        FLUSH,
        PAUSE,
        PERSIST,
        persistReducer,
        persistStore,
        PURGE,
        REGISTER,
        REHYDRATE
} from "redux-persist";

const persistConfig = {
        key: 'root',
        storage,
}

const initialState = {
        userSignin: {
                userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
        },
}

const rootReducer = combineReducers({
        userSignin: userSigninReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
        reducer: persistedReducer,
        initialState,
        middleware: getDefaultMiddleware({
                serializableCheck: {
                        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
        }),
});

export const persistor = persistStore(store);
export default store;