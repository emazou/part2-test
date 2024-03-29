import { configureStore } from '@reduxjs/toolkit'; 
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import { 
    persistReducer,
    persistStore,
    FLUSH, 
    REHYDRATE,
    PAUSE, 
    PERSIST, 
    PURGE, 
    REGISTER } from 'redux-persist';
import userReducer from '@/features/user/userSlice';
import dataQuweyReducer from '@/features/dataQuery/dataQuerySlice';
import userApi  from '@/features/user/userAPI';
import commentApi from '@/features/comment/commentAPI';
import savedQueryApi from '@/features/savedQuery/savedQueryAPI';
import dataQueryApi from '@/features/dataQuery/dataQueryAPI';

const persistConfig = {
    key: 'root',
    storage,
};

/**
 * A reducer that combines all of the reducers for the app.
 */
const rootReducer = combineReducers({
    user: userReducer,
    currentQuery: dataQuweyReducer,
    [userApi.reducerPath]: userApi.reducer,
    [savedQueryApi.reducerPath]: savedQueryApi.reducer,
    [dataQueryApi.reducerPath]: dataQueryApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
});

/**
 * A reducer that persists the root reducer to local storage.
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * A store that uses the persisted reducer and the userApi middleware.
 */
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        },
    })
        .concat(userApi.middleware)
        .concat(savedQueryApi.middleware)
        .concat(dataQueryApi.middleware)
        .concat(commentApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const persistor = persistStore(store);
