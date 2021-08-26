import { makeStyles } from '@material-ui/styles';
import { useAppSelector } from 'app/hooks';
import LocationMarker from 'components/map/LocateControl';
import { IconMyStore, IconPois, IconStores } from 'components/map/MarkerStyles';
import { LayerActive } from 'constants/layer';
import LayerMap from 'constants/layerMap';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import { GeoJSONMarker } from 'models';
import { Feature, GroupZone } from 'models/dto/groupZone';
import { useEffect, useState } from 'react';
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
import { convertBounds, splitPointToLatLng } from 'utils/common';
import { selectGroupZoneList } from '../groupZoneSlice';
import './style.css';

interface MapProps {
  stores?: GeoJSONMarker;
  pois?: GeoJSONMarker;
  myStore?: GeoJSONMarker;
  selectedGroupZoneId?: number;
  centerGzSelected?: string;
  onChangeBounds: (bounds: string) => void;
  onActiveLayer: (active: LayerActive, bounds: string) => void;
  onCloseLayer: (active: LayerActive) => void;
  onIsShowAll?: (value: boolean) => void;
}
function MapAction({ onChangeBounds, onActiveLayer, onCloseLayer, onIsShowAll }: MapProps) {
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
        case t('groupZone.showAll'): {
          if (onIsShowAll) onIsShowAll(true);
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
        case t('groupZone.showAll'): {
          if (onIsShowAll) onIsShowAll(false);
          break;
        }
      }
    });
  }, []);
  return null;
}

const useStyle = makeStyles((theme) => ({
  root: {
    height: '75vh',
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
  color: 'blue',
  fillColor: 'orange',
  opacity: 0.6
};

export default function GroupZoneMap({
  stores,
  onChangeBounds,
  onActiveLayer,
  onCloseLayer,
  myStore,
  selectedGroupZoneId,
  centerGzSelected,
  pois
}: MapProps) {
  const classes = useStyle();
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const rs = useAppSelector(selectGroupZoneList);
  const handelBoundsChange = (bounds: string) => {
    if (onChangeBounds) onChangeBounds(bounds);
  };
  const handelActive = (active: LayerActive, bounds: string) => {
    if (onActiveLayer) onActiveLayer(active, bounds);
  };
  const handelClose = (active: LayerActive) => {
    if (onCloseLayer) onCloseLayer(active);
  };
  const renderSelected = (selected: Feature) => {
    return (
      <GeoJSON
        key={selected?.properties.f4}
        data={selected?.geometry as any}
        style={gzSelectedStyle}
        onEachFeature={(feature, layer) => {
          layer.bindPopup(selected?.properties.f1 || '');
        }}
      />
    );
  };

  const centerGz = splitPointToLatLng(centerGzSelected || '');
  return (
    <MapContainer
      center={centerGz !== undefined ? centerGz : { lat: 10.772461, lng: 106.698055 }}
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
        <LayersControl.BaseLayer name={t('map.basic')}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={LayerMap.Basic}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked name={t('map.layerDark')}>
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
        <LayersControl.Overlay name={t('groupZone.showAll')}>
          <Marker position={{ lat: -83.440326, lng: 4.111396 }} icon={IconStores}></Marker>
        </LayersControl.Overlay>
      </LayersControl>
      <LocationMarker />
      <MapAction
        onChangeBounds={handelBoundsChange}
        onActiveLayer={handelActive}
        onCloseLayer={handelClose}
        onIsShowAll={(value) => setShowAll(value)}
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
      {showAll
        ? rs?.features.map((element) => (
            <GeoJSON
              key={element.properties.f4}
              data={element.geometry as any}
              style={
                element.properties.f4 === selectedGroupZoneId ? gzSelectedStyle : gzNormalStyle
              }
              onEachFeature={(feature, layer) => {
                //   layer.on('click', (e) => {
                //     console.log(e.target.feature);
                //     // new Field().doesIntersect(e.target.feature);
                //     e.target.setStyle({
                //       fillColor: 'yellow'
                //     });
                //   });

                layer.bindPopup(element.properties.f1);
              }}
            />
          ))
        : rs?.features.map(
            (el: Feature) => el.properties.f4 === selectedGroupZoneId && renderSelected(el)
          )}
    </MapContainer>
  );
}
