import { makeStyles } from '@material-ui/styles';
import LocationMarker from 'components/map/LocateControl';
import {
  IconStores,
  IconMyStore,
  IconPois,
  IconDot,
  IconTruck,
  IconMoto,
  IconCar
} from 'components/map/MarkerStyles';
import { LayerActive } from 'constants/layer';
import LayerMap from 'constants/layerMap';
import L from 'leaflet';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import { GeoJSONMarker, TrackingAgent } from 'models';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents
} from 'react-leaflet';
import { convertBounds } from 'utils/common';
import './style.css';

interface MapProps {
  stores?: GeoJSONMarker;
  pois?: GeoJSONMarker;
  myStore?: GeoJSONMarker;
  trackings?: TrackingAgent[];
  onChangeBounds: (bounds: string) => void;
  onActiveLayer: (active: LayerActive, bounds: string) => void;
  onCloseLayer: (active: LayerActive) => void;
}
function MapAction({ onChangeBounds, onActiveLayer, onCloseLayer }: MapProps) {
  const map = useMap();

  const { t } = useTranslation();
  //map.addControl()
  const mapEvents = useMapEvents({
    moveend: () => {
      const zoom = mapEvents.getZoom();
      if (zoom > 16) {
        const bounds = convertBounds(mapEvents.getBounds());
        if (onChangeBounds) onChangeBounds(bounds);
      }
    }
  });
  useEffect(() => {
    map.on('overlayadd', (e: any) => {
      switch (e.name) {
        case t('map.stores'): {
          const bounds = convertBounds(mapEvents.getBounds());
          onActiveLayer(LayerActive.Stores, bounds);
          break;
        }

        case t('map.pois'): {
          const bounds = convertBounds(mapEvents.getBounds());
          onActiveLayer(LayerActive.Pois, bounds);
          break;
        }

        case t('map.myStore'): {
          const bounds = convertBounds(mapEvents.getBounds());
          onActiveLayer(LayerActive.MyStore, bounds);
          break;
        }
      }
    });
    map.on('overlayremove', (e: any) => {
      switch (e.name) {
        case t('map.stores'):
          onCloseLayer(LayerActive.Stores);
          break;
        case t('map.pois'):
          onCloseLayer(LayerActive.Pois);
          break;
        case t('map.myStore'):
          onCloseLayer(LayerActive.MyStore);
          break;
      }
    });
  }, []);
  return null;
}

const useStyle = makeStyles((theme) => ({
  root: {
    height: '75vh',
    borderRadius: '10px',
    overflow: 'hidden',
    marginTop: '0px'
  }
}));
const colors = [
  'red',
  'maroon',
  'purple',
  'fuchsia',
  'lime',
  'yellow',
  'navy',
  'aqua',
  'darkgreen',
  'deeppink',
  'orange',
  'lightsalmon'
];
export default function TrackingMap({
  stores,
  onChangeBounds,
  onActiveLayer,
  onCloseLayer,
  myStore,
  pois,
  trackings
}: MapProps) {
  const classes = useStyle();
  const { t } = useTranslation();
  const handelBoundsChange = (bounds: string) => {
    if (onChangeBounds) onChangeBounds(bounds);
  };
  const handelActive = (active: LayerActive, bounds: string) => {
    if (onActiveLayer) onActiveLayer(active, bounds);
  };
  const handelClose = (active: LayerActive) => {
    if (onCloseLayer) onCloseLayer(active);
  };
  const renderTracking = (x: TrackingAgent) => {
    //var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const colorIndex = Math.floor(Math.random() * colors.length);
    let list: any = [];
    // eslint-disable-next-line array-callback-return
    x.locations.map((a, idx) => {
      if (idx === x.locations.length - 1) {
        let iconMap;
        if (x.agent.agentType === 1) {
          iconMap = IconTruck;
        }
        if (x.agent.agentType === 2) {
          iconMap = IconMoto;
        }
        if (x.agent.agentType === 3) {
          iconMap = IconCar;
        }
        list.push(
          <Marker
            key={`${x.agent.id}-${idx}`}
            icon={iconMap}
            position={{
              lat: Number(a.latitude),
              lng: Number(a.longitude)
            }}
          >
            <Popup>{x.agent.username}</Popup>
          </Marker>
        );
      } else {
        list.push(
          <Marker
            key={`${x.agent.id}-${idx}`}
            icon={IconDot}
            position={{
              lat: Number(a.latitude),
              lng: Number(a.longitude)
            }}
          ></Marker>
        );
      }
    });
    return list;
  };
  return (
    <MapContainer
      style={{ marginTop: '0px' }}
      center={{ lat: 10.772461, lng: 106.698055 }}
      zoom={16}
      scrollWheelZoom={true}
      className={classes.root}
      whenCreated={(map) => {
        L.control
          .fullscreen({
            position: 'topleft',
            title: 'Show me the fullscreen !',
            titleCancel: 'Exit fullscreen mode',
            forceSeparateButton: true,
            forcePseudoFullscreen: true,
            fullscreenElement: false
          })
          .addTo(map);
      }}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer name={t('map.normalLayer')}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={LayerMap.Default}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name={t('map.blackWhiteLayer')}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={LayerMap.BlackWhite}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked name={t('map.basic')}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={LayerMap.Basic}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name={t('map.layerDark')}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={LayerMap.Dark}
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay name={t('map.stores')}>
          <Marker position={{ lat: -83.440326, lng: 4.111396 }} icon={IconStores}></Marker>
        </LayersControl.Overlay>
        <LayersControl.Overlay name={t('map.pois')}>
          <Marker position={{ lat: -83.440326, lng: 4.111396 }} icon={IconStores}></Marker>
        </LayersControl.Overlay>
        <LayersControl.Overlay name={t('map.myStore')}>
          <Marker position={{ lat: -83.440326, lng: 4.111396 }} icon={IconStores}></Marker>
        </LayersControl.Overlay>
      </LayersControl>
      <LocationMarker />
      <MapAction
        onChangeBounds={handelBoundsChange}
        onActiveLayer={handelActive}
        onCloseLayer={handelClose}
      />
      {stores?.features.map((e) => (
        <Marker
          key={e.properties.f4}
          position={{
            lat: Number(e.geometry.coordinates[1]),
            lng: Number(e.geometry.coordinates[0])
          }}
          icon={IconStores}
        >
          <Popup>{e.properties.f2}</Popup>
        </Marker>
      ))}
      {myStore?.features.map((e) => (
        <Marker
          key={e.properties.f4}
          icon={IconMyStore}
          position={{
            lat: Number(e.geometry.coordinates[1]),
            lng: Number(e.geometry.coordinates[0])
          }}
        >
          <Popup>{e.properties.f2}</Popup>
        </Marker>
      ))}
      {pois?.features.map((e) => (
        <Marker
          key={e.properties.f4}
          icon={IconPois}
          position={{
            lat: Number(e.geometry.coordinates[0][1]),
            lng: Number(e.geometry.coordinates[0][0])
          }}
        >
          <Popup>{e.properties.f2}</Popup>
        </Marker>
      ))}
      {trackings?.map((e) => renderTracking(e))}
      {/* {trackings
        ?.find((o) => o.agent.id === 1)
        ?.locations?.map((e, idx) => (
          <Marker
            key={idx}
            icon={IconPois}
            position={{
              lat: Number(e.latitude),
              lng: Number(e.longitude)
            }}
          >
            <Popup>{'cc'}</Popup>
          </Marker>
        )) || <></>} */}
    </MapContainer>
  );
}
