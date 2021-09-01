import { makeStyles } from '@material-ui/styles';
import { useAppSelector } from 'app/hooks';
import LocationMarker from 'components/map/LocateControl';
import { IconMyStore, IconPois, IconStores } from 'components/map/MarkerStyles';
import { LayerActive } from 'constants/layer';
import LayerMap from 'constants/layerMap';
import GeoJsonWithUpdates from 'features/group-zone/components/GeoJsonUpdate';
import L from 'leaflet';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import { GeoJSONMarker } from 'models';
import { Feature } from 'models/dto/groupZone';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GeoJSON,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents
} from 'react-leaflet';
import { convertBounds } from 'utils/common';
import { selectFreeZoneList, selectTradeZoneList } from '../tradeZoneSlice';
import './style.css';

interface MapProps {
  stores?: GeoJSONMarker;
  pois?: GeoJSONMarker;
  myStore?: GeoJSONMarker;
  listSelected?: number[];
  tzVersionSelected?: number;
  onChangeBounds: (bounds: string) => void;
  onActiveLayer: (active: LayerActive, bounds: string) => void;
  onCloseLayer: (active: LayerActive) => void;
  onFreeZoneClick?: (value: Feature) => void;
  onFreeZoneRemove?: (value: Feature) => void;
}

function MapAction({ onChangeBounds, onActiveLayer, onCloseLayer }: MapProps) {
  const map = useMap();

  const { t } = useTranslation();
  //map.addControl()
  const mapEvents = useMapEvents({
    moveend: () => {
      const zoom = mapEvents.getZoom();
      if (zoom > 13) {
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
    height: '68vh',
    borderRadius: '10px',
    overflow: 'hidden'
  }
}));
const gzNormalStyle = {
  fill: true,
  color: 'blue',
  fillColor: 'green',
  opacity: 0.6
};
const gzSelectedStyle = {
  fill: true,
  color: 'gray',
  fillColor: 'gray',
  opacity: 0.6
};

export default function MapEditTradeZone({
  stores,
  onChangeBounds,
  onActiveLayer,
  onCloseLayer,
  myStore,
  pois,
  onFreeZoneClick,
  listSelected,
  onFreeZoneRemove,
  tzVersionSelected
}: MapProps) {
  const classes = useStyle();
  const { t } = useTranslation();
  const rs = useAppSelector(selectTradeZoneList);
  const freeZone = useAppSelector(selectFreeZoneList);
  const handelBoundsChange = (bounds: string) => {
    if (onChangeBounds) onChangeBounds(bounds);
  };
  const handelActive = (active: LayerActive, bounds: string) => {
    if (onActiveLayer) onActiveLayer(active, bounds);
  };
  const handelClose = (active: LayerActive) => {
    if (onCloseLayer) onCloseLayer(active);
  };

  return (
    <MapContainer
      center={{ lat: 10.772461, lng: 106.698055 }}
      zoom={13}
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
      {tzVersionSelected &&
        rs.results.map((x) => (
          <GeoJSON
            key={x.id}
            data={x.geom as any}
            style={gzSelectedStyle}
            onEachFeature={(feature, layer) => {
              //   layer.on('click', (e) => {
              //     console.log(e.target.feature);
              //     // new Field().doesIntersect(e.target.feature);
              //     e.target.setStyle({
              //       fillColor: 'yellow'
              //     });
              //   });
              layer.bindPopup(x.name);
            }}
          />
        ))}

      {freeZone.features.length > 0 && (
        <GeoJsonWithUpdates
          data={freeZone.features as any}
          style={gzNormalStyle}
          onEachFeature={(feature, layer) => {
            layer.on('click', (e) => {
              let flag = false;
              // eslint-disable-next-line array-callback-return
              listSelected?.map((item) => {
                if (item === e.target.feature.properties.f3) {
                  flag = true;
                }
              });
              if (!flag) {
                e.target.setStyle({
                  fillColor: 'orange'
                });
                if (onFreeZoneClick) onFreeZoneClick(e.target.feature);
              } else {
                e.target.setStyle({
                  fillColor: 'green'
                });
                if (onFreeZoneRemove) onFreeZoneRemove(e.target.feature);
              }
            });

            layer.bindPopup(feature.properties.f2);
          }}
        />
      )}
    </MapContainer>
  );
}
