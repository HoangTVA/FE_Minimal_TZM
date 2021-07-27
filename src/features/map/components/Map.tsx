import { makeStyles } from '@material-ui/styles';
import LocationMarker from 'components/map/LocateControl';
import L from 'leaflet';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import * as React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

interface MapProps {}

const useStyle = makeStyles((theme) => ({
  root: {
    height: '85vh',
    borderRadius: '10px',
    overflow: 'hidden',
    marginTop: '-39px'
  }
}));
export default function Map(props: MapProps) {
  const classes = useStyle();

  return (
    <MapContainer
      center={{ lat: 10.772461, lng: 106.698055 }}
      zoom={16}
      scrollWheelZoom={true}
      className={classes.root}
      whenCreated={(map) => {
        L.control
          .fullscreen({
            position: 'topleft', // change the position of the button can be topleft, topright, bottomright or bottomleft, default topleft
            title: 'Show me the fullscreen !', // change the title of the button, default Full Screen
            titleCancel: 'Exit fullscreen mode', // change the title of the button when fullscreen is on, default Exit Full Screen

            forceSeparateButton: true, // force separate button to detach from zoom buttons, default false
            forcePseudoFullscreen: true, // force use of pseudo full screen even if full screen API is available, default false
            fullscreenElement: false // Dom element to render in full screen, false by default, fallback to map._container
          })
          .addTo(map);
      }}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="http://3.36.96.192:6281/tile/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}
