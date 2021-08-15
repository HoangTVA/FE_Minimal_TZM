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