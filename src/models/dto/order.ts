export interface Order {
    id: number;
    fromStationId: number;
    toStationId: number;
    batchId: number;
    createdAt: Date;
    updatedAt: Date;
    orderCode: string;
    orderInfo: string;
    status: number;
    packageItems: PackageItem[];
    fromStation: Station;
    toStation: Station;
    orderInfoObj: OrderInfo;
}

export interface Station {
    id: number;
    code: string;
    stationName: string;
    longitude: number;
    latitude: number;
    address: string;
    district: string;
    ward: string;
    city: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export interface PackageItem {
    id: number;
    quantity: number;
    description: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
    itemInfo: string;
    itemInfoObj: ItemInfo;
}
export interface OrderInfo {
    cod: number;
    totalPriceOrder: number;
    weight: number;
    length: number;
    width: number;
    height: number;
    note: string;
    incurred: number;
    receiverName: string;
    email: string,
    phone: string,
    serviceCharge: number;
}
export interface ItemInfo {
    img: string;
    name: string;
}
