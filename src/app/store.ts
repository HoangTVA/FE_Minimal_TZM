import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import adminLevelReducer from 'features/admin-level/adminLevelSlice';
import agentReducer from 'features/agent/agentSlice';
import authReducer from 'features/auth/authSlice';
import groupZoneReducer from 'features/group-zone/groupZoneSlice';
import assetReducer from 'features/manage-assets/assetSlice';
import poiBrandReducer from 'features/pois-brand/poiBrandSlice';
import poiReducer from 'features/pois/poiSlice';
import storeReducer from 'features/store-management/storeSlice';
import teamReducer from 'features/team/teamSlice';
import tzVersionReducer from 'features/trade-zone-version/tzVersionSlice';
import tradeZoneReducer from 'features/trade-zone/tradeZoneSlice';



import createSagaMiddleware from 'redux-saga';
//import { history } from 'utils';
import rootSaga from './rootSaga';

const rootReducer = combineReducers({
  auth: authReducer,
  stores: storeReducer,
  poi: poiReducer,
  adminLevel: adminLevelReducer,
  poiBrands: poiBrandReducer,
  asset: assetReducer,
  groupZone: groupZoneReducer,
  tzVersion: tzVersionReducer,
  tradeZone: tradeZoneReducer,
  team: teamReducer,
  agent: agentReducer
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
