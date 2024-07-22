'use client';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster"; 
import { useState } from 'react';
import dropdownResearchTypes from "@/public/ResearchTypes.json";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Dialog} from 'primereact/dialog';

import {useEffect, useRef, useCallback} from 'react';
import {MapRef, ViewStateChangeEvent} from 'react-map-gl';

import { Map } from "react-map-gl";
type worldMapProps = {
    authorized: boolean | null;
}

type researchType = {
    "name":string
    "code":string
}

export default function Worldmap( {authorized} : worldMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [spinEnabled, setSpinEnabled] = useState(true);
  const spinRef = useRef(true);

  const spinGlobe = useCallback(() => {
    if (!map.current) return;
    
    const secondsPerRevolution = 120;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;

    const zoom = map.current.getZoom();
    if (spinRef.current && zoom < maxSpinZoom) {
      let distancePerSecond = 360 / secondsPerRevolution;
      if (zoom > slowSpinZoom) {
        const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
        distancePerSecond *= zoomDif;
      }
      const center = map.current.getCenter();
      center.lng -= distancePerSecond;
      map.current.easeTo({ center, duration: 1000, easing: (n) => n });
    }
  }, []);

  const addMarker = useCallback((e: mapboxgl.MapMouseEvent) => {
    if (!map.current || spinRef.current) return;
  
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = "url('https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png')";
    el.style.backgroundSize = 'cover';
    el.style.width = '50px';
    el.style.height = '50px';
    el.style.borderRadius = '50%';
    el.style.cursor = 'pointer';
  
    new mapboxgl.Marker(el)
      .setLngLat(e.lngLat)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h1>empty</h1>`)
      )
      .addTo(map.current);
  }, []);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      projection: 'globe',
      zoom: 1.5,
      center: [-90, 40]
    });

    map.current.on('style.load', () => {
      map.current?.setFog({});
    });

    let userInteracting = false;

    map.current.on('mousedown', () => {
      userInteracting = true;
    });

    map.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('dragend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('pitchend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('rotateend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('moveend', () => {
      spinGlobe();
    });

    map.current.on('click', addMarker);

    spinGlobe();

    return () => {
      if (map.current) {
        map.current.off('click', addMarker);
        map.current.remove();
        map.current = null;
      }
    };
  }, [spinGlobe, addMarker]);

  useEffect(() => {
    spinRef.current = spinEnabled;
    if (!spinEnabled && map.current) {
      map.current.stop();
    } else if (spinEnabled) {
      spinGlobe();
    }
  }, [spinEnabled, spinGlobe]);

  const handleSpinClick = () => {
    setSpinEnabled(!spinEnabled);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div ref={mapContainer} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />
      <button
        onClick={handleSpinClick}
        style={{
          font: 'bold 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif',
          backgroundColor: '#3386c0',
          color: '#fff',
          position: 'absolute',
          top: '20px',
          left: '50%',
          zIndex: 1,
          border: 'none',
          width: '200px',
          marginLeft: '-100px',
          display: 'block',
          cursor: 'pointer',
          padding: '10px 20px',
          borderRadius: '3px',
        }}
      >
        {spinEnabled ? 'Pause rotation' : 'Start rotation'}
      </button>
    </div>
  );
};


