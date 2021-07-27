
import authSaga from "features/auth/authSaga";
import storeSaga from "features/store-management/storeSaga";
import { all } from "redux-saga/effects";

export default function* rootSaga() {
    //console.log('Root saga');
    yield all([authSaga(), storeSaga()]);
}