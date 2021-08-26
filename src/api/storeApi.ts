import { PostAttr } from './../models/dto/attr';
import { PostStore, Template, PostTemplate } from './../models/dto/store';
import { PaginationRequest, Response, Store, StoreAttrs, StoreType, TradeZone } from "models";
import axiosClient from "./axiosClient";
import { AttrResponse } from 'models/dto/attrResponse';

const storeApi = {
    getAll(): Promise<Array<Store>> {
        const url = '/stores/brand';
        return axiosClient.get(url);
    },
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
    getAttrField(storeId: string, storeTypeId: string): Promise<AttrResponse[]> {
        const url = '/stores/' + storeId + '/store-type/' + storeTypeId + '/attr-group-details';
        return axiosClient.get(url);
    },
    getTemplates(params: PaginationRequest): Promise<Template[]> {
        const url = '/stores/templates';
        return axiosClient.get(url, { params });
    },
    updateStoreTemplate(id: string, data: PostTemplate): Promise<Store> {
        const url = `/stores/${id}/templates`;
        return axiosClient.put(url, data);
    },
    updateAttrs(id: string, data: PostAttr[]) {
        const url = `/stores/${id}/attrs-insert-value`;
        return axiosClient.put(url, data);
    },
    getStoreTradeZones(id: string): Promise<TradeZone[]> {
        const url = `/stores/${id}/trade-zones`;
        return axiosClient.get(url);
    },
}
export default storeApi;