import { IconMyStore } from 'components/map/MarkerStyles';
import { LatLngExpression } from 'leaflet';
import { useMemo, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';

interface DraggableMarkerProps {
  location?: LatLngExpression;
  onDraggable: (point: LatLngExpression) => void;
}
export function DraggableMarker({ location, onDraggable }: DraggableMarkerProps) {
  const markerRef = useRef(null);
  const map = useMap();
  if (location) map.flyTo(location);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker: any = markerRef.current;
        if (marker != null) {
          if (onDraggable) onDraggable(marker.getLatLng());
        }
      }
    }),
    []
  );
  if (!location) return <></>;
  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={location}
      ref={markerRef}
      icon={IconMyStore}
    >
      <Popup minWidth={90}>
        <span>{location.toString()}</span>
      </Popup>
    </Marker>
  );
}
