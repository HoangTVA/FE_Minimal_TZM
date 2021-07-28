import { LatLngExpression } from 'leaflet';
import * as React from 'react';
import { Marker, useMap } from 'react-leaflet';

interface SetMarkerProps {
  position?: LatLngExpression;
}

export default function SetMarker({ position }: SetMarkerProps) {
  const map = useMap();
  if (position) map.flyTo(position);

  if (!position) return <></>;
  return (
    <Marker position={position}>
      {/* <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup> */}
    </Marker>
  );
}
