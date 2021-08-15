import { TzVersionRequest } from './../models/dto/tradeZone';
import { TzVersion } from 'models';
import axiosClient from "./axiosClient";

const tzVersionApi = {
    getAll(params: TzVersionRequest): Promise<TzVersion[]> {
        const url = '/trade-zone-versions';
        return axiosClient.get(url, { params });
    }
}
export default tzVersionApi;