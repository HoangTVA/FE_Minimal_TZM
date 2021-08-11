export interface FreeZone {
    type: string;
    features: Feature[];
}

export interface Feature {
    type: FeatureType;
    geometry: Geometry;
    properties: Properties;
}

export interface Geometry {
    type: GeometryType;
    coordinates: Array<Array<Array<number[]>>>;
}

export enum GeometryType {
    MultiPolygon = "MultiPolygon",
}

export interface Properties {
    f2: string;
    f3: number;
    f4: number;
}

export enum FeatureType {
    Feature = "Feature",
}
