import { PaginationRequest } from 'models';
// export interface Poi {
//     id: number;
//     name: string;
//     geom: string;
//     status: number;
//     createDate: Date;
//     poiCode: string;
//     alias: string;
//     notes: string;
//     brandPoiCode: string;
//     createDatePoiBrand: Date;
//     statusPoiBrand: number;
//     brandId: number;
//     brandName: string;
//     poiTypeName: string;
//     poiTypeId: number;
//     isNeedApproval: boolean;
//     countPoiBrands: number;
// }
export interface Poi {
    point: Point;
    id: number;
    name: string;
    geom: string;
    status: number;
    createDate: Date;
    poiCode: string;
    alias: string;
    notes: string;
    brandPoiCode: string;
    createDatePoiBrand: Date;
    createBy: string;
    statusPoiBrand: number;
    brandId: number;
    brandName: string;
    poiTypeName: string;
    poiTypeId: number;
    isNeedApproval: boolean;
    countPoiBrands: number;
}

export interface Point {
    type: string;
    coordinates: Array<number[]>;
}
export interface PoiPagingRequest extends PaginationRequest {
    brandId?: number;
    provinceId?: number;
    districtId?: number;
    wardId?: number;
    IsGetForPoiBrand?: boolean;
    poiTypeId?: number;
    status?: number;
}
export interface PostPoiBrand {
    brandId: number;
    poiId: number;
    alias: string;
    notes: string;
    brandPoiCode: string;
    createBy: string;
}
export interface PoiType {
    id: number;
    name: string;
}

