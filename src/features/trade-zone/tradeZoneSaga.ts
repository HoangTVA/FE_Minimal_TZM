import { FreeZonesRequest, tradeZoneActions } from './tradeZoneSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import tradeZoneApi from 'api/tradeZoneApi';
import tzVersionApi from 'api/tradeZoneVersionApi';
import { Response, TradeZone, TradeZonePagingRequest, TzVersion, TzVersionRequest } from 'models';
import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import { FreeZone } from 'models/dto/freeZone';
import { FreeWardStyle } from 'constants/freeWardStyle';




function* fetchTradeZoneList(action: PayloadAction<TradeZonePagingRequest>) {
    try {
        const rs: Response<TradeZone> = yield call(tradeZoneApi.getAll, action.payload);
        yield put(tradeZoneActions.fetchTradeZoneListSuccess(rs));
    } catch (error) {
        yield put(tradeZoneActions.fetchTradeZoneListError());
    }
}
function* filterWithDebounce(action: PayloadAction<TradeZonePagingRequest>) {
    yield put(tradeZoneActions.setFilter(action.payload));
}
function* fetchFreeZoneList(action: PayloadAction<FreeZonesRequest>) {
    try {
        if (action.payload.type === FreeWardStyle.District) {
            const rs: FreeZone = yield call(tzVersionApi.getFreeDistrict, action.payload.tzVersionId);
            yield put(tradeZoneActions.fetchFreeZoneSuccess(rs));
        } else if (action.payload.type === FreeWardStyle.Ward) {
            const rs: FreeZone = yield call(tzVersionApi.getFreeWard, action.payload.tzVersionId)
            yield put(tradeZoneActions.fetchFreeZoneSuccess(rs));
        } else if (action.payload.type === FreeWardStyle.SystemZone) {
            const rs: FreeZone = yield call(tzVersionApi.getFreeSystemZone, action.payload.tzVersionId)
            yield put(tradeZoneActions.fetchFreeZoneSuccess(rs));
        }
    } catch (error) {
        yield put(tradeZoneActions.fetchFreeZoneError());
    }
}
export default function* tradeZoneSaga() {
    yield takeLatest(tradeZoneActions.fetchTradeZoneList.type, fetchTradeZoneList);
    yield takeLatest(tradeZoneActions.fetchFreeZoneList.type, fetchFreeZoneList);
    yield debounce(800, tradeZoneActions.setFilterWithDebounce.type, filterWithDebounce);
}