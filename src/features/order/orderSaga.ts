import { PayloadAction } from '@reduxjs/toolkit';
import orderApi from 'api/orderApi';
import { Order, PaginationRequest, Response } from 'models';
import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import { orderActions } from './orderSlice';




function* fetchOrderList(action: PayloadAction<PaginationRequest>) {
    try {
        const rs: Response<Order> = yield call(orderApi.getAll, action.payload);
        yield put(orderActions.fetchOrderListSuccess(rs));
    } catch (error) {
        yield put(orderActions.fetchOrderListError());
    }
}
function* searchWithDebounce(action: PayloadAction<PaginationRequest>) {
    yield put(orderActions.setFilter(action.payload));
}
export default function* orderSaga() {
    yield takeLatest(orderActions.fetchOrderList.type, fetchOrderList);
    yield debounce(800, orderActions.setFilterWithDebounce.type, searchWithDebounce)
}