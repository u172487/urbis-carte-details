
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix pour les icônes Leaflet avec React
import 'leaflet/dist/leaflet.css';
import { longFormatters } from 'date-fns';

interface MapViewProps {
  onMapClick: (lat: number, lon: number) => void;
}

const MapView: React.FC<MapViewProps> = ({ onMapClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialiser la carte
    const map = L.map(mapRef.current).setView([46.603354, 1.888334], 6);
    // Ajouter la couche de tuiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);

    // Gérer les clics sur la carte
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      // Supprimer le marqueur précédent s'il existe
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      console.log(lat, lng)
      
      // Créer un nouveau marqueur
      const marker = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).addTo(map);
      
      markerRef.current = marker;
      // Zoomer sur le point cliqué en douceur
      map.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
      
      onMapClick(lat, lng);
    });

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-full cursor-crosshair"
      style={{ background: '#a7c5bd' }}
    />
  );
};

export default MapView;
