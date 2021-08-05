import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import adminLevelReducer from 'features/admin-level/adminLevelSlice';
import authReducer from 'features/auth/authSlice';
import poiBrandReducer from 'features/pois-brand/poiBrandSlice';
import poiReducer from 'features/pois/poiSlice';
import storeReducer from 'features/store-management/storeSlice';


import createSagaMiddleware from 'redux-saga';
//import { history } from 'utils';
import rootSaga from './rootSaga';

const rootReducer = combineReducers({
  auth: authReducer,
  stores: storeReducer,
  poi: poiReducer,
  adminLevel: adminLevelReducer,
  poiBrands: poiBrandReducer
})

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
    }).concat(sagaMiddleware),
});
sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
