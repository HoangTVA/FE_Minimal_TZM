import { GeoJSONMarker, Province, RequestBounds } from 'models';
import axiosClient from "./axiosClient";


const mapApi = {
    getStores(coordinates: RequestBounds): Promise<GeoJSONMarker> {
        const url = '/map/store';
        return axiosClient.post(url, coordinates);
    },
    getPois(coordinates: RequestBounds): Promise<GeoJSONMarker> {
        const url = '/map/pois';
        return axiosClient.post(url, coordinates);
    },
    getMyStores(): Promise<GeoJSONMarker> {
        const url = 'map/store/brand';
        return axiosClient.get(url);
    }
}
export default mapApi;