import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Order, OrderPagingRequest, Response } from 'models';
import { toast } from 'react-toastify';
import i18n from 'translation/i18n';

export interface TaskState {
    loading: boolean;
    orders: Response<Order>;
    filter: OrderPagingRequest;
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
        fetchOrderList(state, action: PayloadAction<OrderPagingRequest>) {
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
        setFilter(state, action: PayloadAction<OrderPagingRequest>) {
            state.filter = action.payload;
        },
        setFilterWithDebounce(state, action: PayloadAction<OrderPagingRequest>) { }
    }
});
//actions
export const orderActions = orderSlice.actions;
//selectors
export const selectLoading = (state: RootState) => state.order.loading;
export const selectOrderList = (state: RootState) => state.order.orders;
export const selectOrderOptions = createSelector(selectOrderList, (orders) => orders.results.map((order) => ({
    name: order.orderCode,
    id: order.id
})));
export const selectFilter = (state: RootState) => state.order.filter;
//reducers
const orderReducer = orderSlice.reducer;
export default orderReducer;
