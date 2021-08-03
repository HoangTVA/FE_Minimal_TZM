import { RootState } from 'app/store';
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaginationRequest, Response, Store, StoreType } from "models";

export interface StoreState {
    loading: boolean,
    response: Response<Store>,
    filter: PaginationRequest,
    storeTypes: StoreType[],
}
const initialState: StoreState = {
    loading: false,
    response: {
        pageNumber: 1,
        pageSize: 10,
        results: [],
        totalNumberOfPages: 0,
        totalNumberOfRecords: 0
    },
    filter: {
        page: 1,
        pageSize: 10,
    },
    storeTypes: []
}

const storeSlice = createSlice({
    name: 'store',
    initialState,
    reducers: {
        fetchStores(state, action: PayloadAction<PaginationRequest>) {
            state.loading = true
        },
        fetchStoreSuccess(state, action: PayloadAction<Response<Store>>) {
            state.loading = false
            state.response = action.payload;
        },
        fetchStoreError(state, action: PayloadAction<string>) {
            state.loading = false
        },
        fetchStoreType(state) { },
        fetchStoreTypeSuccess(state, action: PayloadAction<StoreType[]>) {
            state.storeTypes = action.payload;
        },
        fetchStoreTypeError(state) { },
        setFilter(state, action: PayloadAction<PaginationRequest>) {
            state.filter = action.payload;
        },
        setFilterWithDebounce(state, action: PayloadAction<PaginationRequest>) {
        },
    }
});
//actions
export const storeActions = storeSlice.actions;
//selector
export const selectStoresResponse = (state: RootState) => state.stores.response;
export const selectLoading = (state: RootState) => state.stores.loading;
export const selectFilter = (state: RootState) => state.stores.filter;
export const selectStoreType = (state: RootState) => state.stores.storeTypes;
export const selectStoreTypeOptions = createSelector(selectStoreType, (storeTypes) => storeTypes.map((storeType) => ({
    name: storeType.name,
    id: storeType.id
})));

//reducers
const storeReducer = storeSlice.reducer;
export default storeReducer;