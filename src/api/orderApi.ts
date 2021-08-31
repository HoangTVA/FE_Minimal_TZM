import { PaginationRequest, Response, Order } from "models";
import axiosClient from "./axiosClient";

const orderApi = {
    getAll(params: PaginationRequest): Promise<Response<Order>> {
        const url = '/orders';
        return axiosClient.get(url, { params });
    },
    remove(id: number): Promise<Order> {
        const url = `/orders/${id}`;
        return axiosClient.delete(url);
    },
    getById(id: string): Promise<Order> {
        const url = `/orders/${id}`;
        return axiosClient.get(url);
    },
    update(id: string, data: Order): Promise<Order> {
        const url = `/orders/${id}`;
        return axiosClient.put(url, data);
    },
    add(data: Order): Promise<Order> {
        const url = '/orders';
        return axiosClient.post(url, data);
    },
}
export default orderApi;