export interface Store {
    id: number;
    name: string;
    wkt: string;
    createDate: Date;
    brandId: number;
    address: string;
    brandName: string;
    type: string;
    status: number;
    storeStreetSegments: any[];
    abilityToServe: number;
    timeSlot: string;
    geom: Geom;
    storeTypeName: string;
    imageUrl?: string;
    storeTypeId?: number;
    storeCode?: string;
}

export interface Geom {
    type: string;
    coordinates: number[];
}
export interface StoreType {
    id: number;
    name: string;
}
export interface PostStore {
    name: string;
    brandId?: number;
    address: string;
    coordinateString: string;
    imageUrl?: string;
    storeCode: string;
    storeTypeId: number;
}