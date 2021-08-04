import L from 'leaflet';
import icons from "assets/icons/l3.svg";
import poi from "assets/ics-map/ics-map-pois.svg";
import myStore from "assets/ics-map/ics-map-store.svg";
const IconMarker = new L.Icon({
  iconSize: [42, 56],
  popupAnchor: [-3, -56],
  iconAnchor: [22, 56],
  iconUrl: icons

});
const IconPois = new L.Icon({
  iconSize: [42, 56],
  popupAnchor: [-3, -56],
  iconAnchor: [22, 56],
  iconUrl: poi

});
const IconMyStore = new L.Icon({
  iconSize: [42, 56],
  popupAnchor: [-3, -56],
  iconAnchor: [22, 56],
  iconUrl: myStore

});

export { IconMarker, IconMyStore, IconPois };
