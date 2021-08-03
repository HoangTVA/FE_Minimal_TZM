import { FetchAttrs, templateActions } from './templateSlice';
import { Store, StoreAttrs, TemplateProps } from "models";
import { all, call, put, take, takeLatest } from 'redux-saga/effects';
import storeApi from 'api/storeApi';
import { PayloadAction } from '@reduxjs/toolkit';

function* fetchStore() {
    const data: Array<Store> = yield call(storeApi.getAll);
    yield put(templateActions.setStores(data));
}
function* fetchAttrs(payload: FetchAttrs) {
    const data: Array<StoreAttrs> = yield call(storeApi.getAttr, payload);
    const rs = data.find((x) => x.id === 5);
    //const user02 = <User>{};
    let template = {} as TemplateProps;
    // eslint-disable-next-line array-callback-return
    rs?.attrs.map((e) => {

        if (e.id === 15) {
            template.zalo = e.value;
        }
        if (e.id === 16) {
            template.facebook = e.value;
        }
        if (e.id === 17) {
            template.youtube = e.value;
        }
        if (e.id === 18) {
            template.backgroundImage = e.value;
        }
        if (e.id === 19) {
            template.logoImage = e.value;
        }
        if (e.id === 20) {
            template.title = e.value;
        }
        if (e.id === 21) {
            template.address = e.value;
        }
        if (e.id === 22) {
            template.website = e.value;
        }
        if (e.id === 23) {
            template.phone = e.value;
        } if (e.id === 24) {
            template.slogan = e.value;
        }

    });
    if (template) {
        yield put(templateActions.setAttrs(template));
    }

}
function* fetchData() {
    try {
        yield all(
            [
                call(fetchStore),
            ]
        );
        yield put(templateActions.fetchDataSuccess());
    } catch (error) {
        yield put(templateActions.fetchDataFailed());
        console.log('error: ', error);
    }
}
function* fetchDataAttrs(payload: FetchAttrs) {
    try {
        yield all(
            [
                call(fetchAttrs, payload),
            ]
        );
        yield put(templateActions.fetchDataSuccess());
    } catch (error) {
        yield put(templateActions.fetchDataFailed());
        console.log('error: ', error);
    }
}
export default function* templateSaga() {
    yield takeLatest(templateActions.fetchStores.type, fetchData);
    const action: PayloadAction<FetchAttrs> = yield take(templateActions.fetchAttrs.type);
    yield call(fetchDataAttrs, action.payload);
    //yield takeLatest(templateActions.fetchAttrs.type, fetchDataAttrs)
}