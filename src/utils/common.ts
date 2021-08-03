import { useTranslation } from 'react-i18next';
import { LatLngBounds, LatLngExpression } from 'leaflet';
import { User } from "models";
import { toast } from 'react-toastify';
import { useSnackbar } from 'notistack5';

export const getCurrentUser = () => {
    try {
        const user: User = JSON.parse(localStorage.getItem('user') || '');
        return user;
    } catch (error) {
        return null;
    }

}
export const splitWktToLatLng = (wkt: string) => {
    const start = wkt.indexOf('(');
    const end = wkt.indexOf(')');
    const sub = wkt.substring(start + 2, end);
    const rs = sub.split(' ');
    const latLng: LatLngExpression = [Number(rs[1]), Number(rs[0])];
    return latLng
}
export const splitWktTopPostLatLng = (wkt: string) => {
    const start = wkt.indexOf('(');
    const end = wkt.indexOf(')');
    const sub = wkt.substring(start + 2, end);
    const rs = sub.split(' ');
    const latLng: string = rs[0] + " " + rs[1];
    return latLng
}
export const convertBounds = (bounds: LatLngBounds) => {
    const rs = `${bounds.getSouthWest().lng} ${bounds.getSouthWest().lat}, ` +
        `${bounds.getNorthWest().lng} ${bounds.getNorthWest().lat}, ` +
        `${bounds.getNorthEast().lng} ${bounds.getNorthEast().lat}, ` +
        `${bounds.getSouthEast().lng} ${bounds.getSouthEast().lat}, ` +
        `${bounds.getSouthWest().lng} ${bounds.getSouthWest().lat}`
    return rs;
}