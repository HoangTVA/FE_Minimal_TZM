import { PostStore } from './../models/dto/store';
import { PaginationRequest, Response, Store, StoreAttrs, StoreType } from "models";
import axiosClient from "./axiosClient";
//import { FetchAttrs } from 'features/template/templateSlice';

const storeApi = {
    getAll(): Promise<Array<Store>> {
        const url = '/stores/brand';
        return axiosClient.get(url);
    },
    // getAttr(params: FetchAttrs): Promise<Array<StoreAttrs>> {
    //     const url = '/stores/' + params.storeId + '/store-type/' + params.typeId + '/attr-group-details';
    //     return axiosClient.get(url);
    // },
    getAllPaging(params: PaginationRequest): Promise<Response<Store>> {
        const url = '/stores/brand/paging';
        return axiosClient.get(url, { params });
    },
    getStoreTypes(): Promise<StoreType[]> {
        const url = '/stores/store-type';
        return axiosClient.get(url);
    },
    remove(id: number): Promise<Store> {
        const url = `/stores/brand/${id}`;
        return axiosClient.delete(url);
    },
    getStoreById(id: string): Promise<Store> {
        const url = `/stores/${id}`;
        return axiosClient.get(url);
    },
    add(data: PostStore): Promise<Store> {
        const url = '/stores/brand';
        return axiosClient.post(url, data);
    },
    update(id: number, data: PostStore): Promise<Store> {
        const url = `/stores/for-brand/${id}`;
        return axiosClient.put(url, data);
    },
}
export default storeApi;