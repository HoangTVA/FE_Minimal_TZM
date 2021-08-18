import { TzVersion } from 'models';
import { FreeZone } from 'models/dto/freeZone';
import { PutTzVersion, TzVersionRequest } from './../models/dto/tradeZone';
import axiosClient from "./axiosClient";

const tzVersionApi = {
    getAll(params: TzVersionRequest): Promise<TzVersion[]> {
        const url = '/trade-zone-versions';
        return axiosClient.get(url, { params });
    },
    remove(id: number): Promise<TzVersion> {
        const url = `/trade-zone-versions/${id}`;
        return axiosClient.delete(url);
    },
    getById(id: string): Promise<TzVersion> {
        const url = `/trade-zone-versions/${id}`;
        return axiosClient.get(url);
    },
    update(id: string, data: PutTzVersion): Promise<TzVersion> {
        const url = `/trade-zone-versions/${id}`;
        return axiosClient.put(url, data);
    },
    add(data: PutTzVersion): Promise<TzVersion> {
        const url = '/trade-zone-versions';
        return axiosClient.post(url, data);
    },
    getFreeWard(id: number): Promise<FreeZone> {
        const url = `/trade-zone-versions/${id}/free-wards`;
        return axiosClient.get(url);
    },
    getFreeDistrict(id: number): Promise<FreeZone> {
        const url = `/trade-zone-versions/${id}/free-districts`;
        return axiosClient.get(url);
    },
    getFreeSystemZone(id: number): Promise<FreeZone> {
        const url = `/trade-zone-versions/${id}/free-systemzones`;
        return axiosClient.get(url);
    },
}
export default tzVersionApi;