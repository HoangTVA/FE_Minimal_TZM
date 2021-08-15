import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from 'app/store';
import { TzVersion, TzVersionRequest } from "models";
import { toast } from 'react-toastify';
import i18n from 'translation/i18n';
import { convertBinaryFilterToList, convertTzVersionToEvents } from "utils/common";



export interface TzVersionState {
    loading: boolean;
    tzVersions: TzVersion[];
    filter: TzVersionRequest;
    storeId: number;
}
const initialState: TzVersionState = {
    loading: false,
    tzVersions: [],
    filter: {
        dateFilter: '1111111',
        timeSlot: '111111111111111111111111',
        groupZoneId: 0,
        storeId: 0
    },
    storeId: 0
}
const tzVersionSlice = createSlice({
    name: 'tzVersion',
    initialState,
    reducers: {
        // poi brands
        fetchTzVersionList(state, action: PayloadAction<TzVersionRequest>) {
            state.loading = true;
        },
        fetchTzVersionListSuccess(state, action: PayloadAction<TzVersion[]>) {
            state.tzVersions = action.payload;
            state.loading = false;
        },
        fetchTzVersionListError(state) {
            toast.error(i18n.t('common.errorText'));
            state.loading = false;
        },
        setFilter(state, action: PayloadAction<TzVersionRequest>) {
            state.filter = action.payload;
        },
        setFilterWithDebounce(state, action: PayloadAction<TzVersionRequest>) {
        },
    }
});
//actions
export const tzVersionActions = tzVersionSlice.actions;
//selectors
export const selectLoading = (state: RootState) => state.groupZone.loading;
export const selectTzVersionList = (state: RootState) => state.tzVersion.tzVersions;
export const selectFilter = (state: RootState) => state.tzVersion.filter;
export const selectStoreId = (state: RootState) => state.tzVersion.storeId;
export const selectTimeFilterSelected = createSelector(selectFilter, (filter) => (convertBinaryFilterToList(filter.timeSlot)));
export const selectDateFilterSelected = createSelector(selectFilter, (filter) => (convertBinaryFilterToList(filter.dateFilter)));

export const selectTzVersionEvents = createSelector(selectTzVersionList, (list) => (convertTzVersionToEvents(list.filter(f => f.isActive === true))));
//reducers
const tzVersionReducer = tzVersionSlice.reducer;
export default tzVersionReducer;