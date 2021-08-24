import { agentActions } from './agentSlice';
import { AgentPagingRequest, Agent } from 'models';
import { PayloadAction } from '@reduxjs/toolkit';
import { AssetPagingRequest, Response } from 'models';
import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import agentApi from 'api/agentApi';



function* fetchAgentList(action: PayloadAction<AgentPagingRequest>) {
    try {
        const rs: Response<Agent> = yield call(agentApi.getAll, action.payload);
        yield put(agentActions.fetchAgentListSuccess(rs));
    } catch (error) {
        yield put(agentActions.fetchAgentListError());
    }
}
function* searchWithDebounce(action: PayloadAction<AssetPagingRequest>) {
    yield put(agentActions.setFilter(action.payload));
}
export default function* agentSaga() {
    yield takeLatest(agentActions.fetchAgentList.type, fetchAgentList);
    yield debounce(800, agentActions.setFilterWithDebounce.type, searchWithDebounce)
}