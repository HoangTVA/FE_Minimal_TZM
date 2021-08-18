import { PostTradeZone, Response, TradeZone, TradeZonePagingRequest, TzVersion } from 'models';
import axiosClient from "./axiosClient";

const tradeZoneApi = {
    getAll(params: TradeZonePagingRequest): Promise<Response<TradeZone>> {
        const url = '/trade-zones';
        return axiosClient.get(url, { params });
    },
    remove(id: number): Promise<TradeZone> {
        const url = `/trade-zones/${id}`;
        return axiosClient.delete(url);
    },
    getById(id: string): Promise<TradeZone> {
        const url = `/trade-zones/${id}`;
        return axiosClient.get(url);
    },
    // update(id: string, data: PutTzVersion): Promise<TradeZone> {
    //     const url = `/trade-zones/${id}`;
    //     return axiosClient.put(url, data);
    // },
    add(data: PostTradeZone): Promise<TradeZone> {
        const url = '/trade-zones';
        return axiosClient.post(url, data);
    },
}
export default tradeZoneApi;