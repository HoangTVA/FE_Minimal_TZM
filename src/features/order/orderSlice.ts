import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { PaginationRequest, Response, Order } from 'models';
import { toast } from 'react-toastify';
import i18n from 'translation/i18n';

export interface TaskState {
    loading: boolean;
    orders: Response<Order>;
    filter: PaginationRequest;
}
const initialState: TaskState = {
    loading: false,
    filter: {
        page: undefined,
        pageSize: undefined
    },
    orders: {
        pageNumber: 1,
        pageSize: 10,
        results: [],
        totalNumberOfPages: 0,
        totalNumberOfRecords: 0
    }
};
const orderSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        // poi brands
        fetchOrderList(state, action: PayloadAction<PaginationRequest>) {
            state.loading = true;
        },
        fetchOrderListSuccess(state, action: PayloadAction<Response<Order>>) {
            state.orders = action.payload;
            state.loading = false;
        },
        fetchOrderListError(state) {
            toast.error(i18n.t('common.errorText'));
            state.loading = false;
        },
        //filter
        setFilter(state, action: PayloadAction<PaginationRequest>) {
            state.filter = action.payload;
        },
        setFilterWithDebounce(state, action: PayloadAction<PaginationRequest>) { }
    }
});
//actions
export const orderActions = orderSlice.actions;
//selectors
export const selectLoading = (state: RootState) => state.order.loading;
export const selectTeamList = (state: RootState) => state.order.orders;
// export const selectTeamsOptions = createSelector(selectTeamList, (tasks) =>
//   tasks.results.map((team) => ({
//     name: team.name,
//     id: team.id
//   }))
// );
export const selectFilter = (state: RootState) => state.order.filter;
//reducers
const orderReducer = orderSlice.reducer;
export default orderReducer;
