import { Template } from './../../models/dto/store';
import { storeActions } from './storeSlice';
import { call, debounce, put, takeLatest } from "redux-saga/effects";
import { PaginationRequest, Response, Store, StoreType } from 'models';
import storeApi from 'api/storeApi';
import { PayloadAction } from '@reduxjs/toolkit';


function* fetchStore(action: PayloadAction<PaginationRequest>) {
    try {
        const rs: Response<Store> = yield call(storeApi.getAllPaging, action.payload);
        yield put(storeActions.fetchStoreSuccess(rs));
    } catch (error) {
        yield put(storeActions.fetchStoreError(''));
    }
}
function* fetchStoreType() {
    try {
        const rs: Array<StoreType> = yield call(storeApi.getStoreTypes);
        yield put(storeActions.fetchStoreTypeSuccess(rs));
    } catch (error) {
        yield put(storeActions.fetchStoreTypeError());
    }
}
function* fetchStoreTemplate(action: PayloadAction<PaginationRequest>) {
    try {
        const rs: Response<Template> = yield call(storeApi.getTemplates, action.payload);
        yield put(storeActions.fetchStoreTemplateSuccess(rs));
    } catch (error) {
        yield put(storeActions.fetchStoreTemplateError());
    }
}
function* searchWithDebounce(action: PayloadAction<PaginationRequest>) {
    console.log(action.payload);
    yield put(storeActions.setFilter(action.payload));
}
function* searchWithDebounceTemplate(action: PayloadAction<PaginationRequest>) {
    yield put(storeActions.setFilterTemplate(action.payload));
}
export default function* storeSaga() {
    //watch fetch student action
    yield takeLatest(storeActions.fetchStores.type, fetchStore);
    yield takeLatest(storeActions.fetchStoreType.type, fetchStoreType);
    yield takeLatest(storeActions.fetchStoreTemplates.type, fetchStoreTemplate);
    yield debounce(800, storeActions.setFilterWithDebounce.type, searchWithDebounce);
    yield debounce(800, storeActions.setFilterWithDebounceTemplate.type, searchWithDebounceTemplate)
}