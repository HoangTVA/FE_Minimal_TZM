import adminLevelSaga from "features/admin-level/adminLevelSaga";
import authSaga from "features/auth/authSaga";
import groupZoneSaga from "features/group-zone/groupZoneSaga";
import assetSaga from "features/manage-assets/assetSaga";
import poiBrandsSaga from "features/pois-brand/poiBrandSaga";
import poiSaga from "features/pois/poiSaga";
import storeSaga from "features/store-management/storeSaga";
import tzVersionSaga from "features/trade-zone-version/tzVersionSaga";
import tradeZoneSaga from "features/trade-zone/tradeZoneSaga";
import { all } from "redux-saga/effects";

export default function* rootSaga() {
    yield all([authSaga(), storeSaga(), poiSaga(), adminLevelSaga(), poiBrandsSaga(), assetSaga(), groupZoneSaga(), tzVersionSaga(), tradeZoneSaga()]);
}