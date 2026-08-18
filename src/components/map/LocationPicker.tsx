import { useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet icon paths in Vite
// We have to point to the unpkg CDN or use a custom icon since Vite bundles assets differently.
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface LocationPickerProps {
  position: [number, number]; // [lat, lng]
  onChange: (position: [number, number]) => void;
  className?: string;
}

function LocationMarker({ position, onChange }: LocationPickerProps) {
  const markerRef = useRef<L.Marker>(null);
  
  // Update position on map click
  useMapEvents({
    click(e) {
      onChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          onChange([latLng.lat, latLng.lng]);
        }
      },
    }),
    [onChange]
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Popup minWidth={90}>
        <span className="text-sm font-medium">Drag me to the exact location</span>
      </Popup>
    </Marker>
  );
}

export function LocationPicker({ position, onChange, className = "h-64 w-full rounded-md z-0" }: LocationPickerProps) {
  return (
    <div className={`overflow-hidden border border-slate-300 rounded-md ${className}`}>
      <MapContainer 
        center={position} 
        zoom={15} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} onChange={onChange} />
      </MapContainer>
    </div>
  );
}
