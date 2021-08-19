import { PaginationRequest } from "./common";

export interface TzVersion {
    id: number;
    name: string;
    isActive: boolean;
    dateFilter: string;
    timeSlot: string;
    description: string;
    groupZoneId: number;
    groupZoneName: string;
    storesName: StoresName[];
}
export interface TzVersionRequest {
    timeSlot: string;
    dateFilter: string;
    groupZoneId: number;
    storeId: number;
}
export interface StoresName {
    id: number;
    name: string;
}
export interface PutTzVersion {
    name: string;
    description: string;
    dateFilter: string;
    timeSlot: string;
    brandId?: number;
    groupZoneId: number;
}
export interface TradeZone {
    id: number;
    name: string;
    geom: Geom2;
    groupZoneId: number;
    tradeZoneVersionName: string;
    groupZoneName: string;
    tradeZoneVersionId: number;
    timeSlot: string;
    dateFilter: string;
    storesName: StoresName[];
    center: string;
}
export interface Geom2 {
    type: Type;
    coordinates: Array<Array<number[]>>;
}

export enum Type {
    Polygon = "Polygon",
}
export interface TradeZonePagingRequest extends PaginationRequest {
    tradeZoneVersionId?: number;
    groupZoneId?: number;
}
export interface PostTradeZone {
    name: string;
    listZoneId: number[];
    type: number;
    groupZoneId: number;
    stores: StoresName[];
    storesName: StoresName[];
    tradeZoneVersionId: number;
}