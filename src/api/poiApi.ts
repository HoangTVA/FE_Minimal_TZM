import { Response, Poi, PoiPagingRequest, PostPoiBrand, PoiType } from 'models';
import axiosClient from "./axiosClient";

const poiApi = {
    getAll(params: PoiPagingRequest): Promise<Response<Poi>> {
        const url = '/pois';
        return axiosClient.get(url, { params });
    },
    addPoi(data: Poi): Promise<Poi> {
        const url = '/pois';
        return axiosClient.post(url, data);
    },
    addPoiBrand(data: PostPoiBrand): Promise<Poi> {
        const url = '/pois/brand';
        return axiosClient.post(url, data);
    },
    updatePoiBrand(data: PostPoiBrand): Promise<Poi> {
        const url = '/pois/' + data.poiId + '/brand';
        return axiosClient.patch(url, data);
    },
    remove(id: number): Promise<Poi> {
        const url = `/pois/${id}/brand`;
        return axiosClient.delete(url);
    },
    getPoiById(id: number): Promise<Poi> {
        const url = `/pois/${id}/brand`;
        return axiosClient.get(url);
    },
    getPoiTypes(): Promise<PoiType[]> {
        const url = '/pois/poi-type';
        return axiosClient.get(url);
    }
    // getPoirandById(id: number): Promise<Poi> {
    //     const url = `/pois/${id}/brand`;
    //     return axiosClient.get(url);
    // }
}
export default poiApi;