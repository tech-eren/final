import { useRef, useMemo, useEffect } from 'react';
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
  const map = useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      onChange(newPos);
    },
  });

  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          const newPos: [number, number] = [latLng.lat, latLng.lng];
          onChange(newPos);
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
        <span className="text-sm font-medium">Drag me or click anywhere on the map</span>
      </Popup>
    </Marker>
  );
}

export function LocationPicker({ position, onChange, className = "h-64 w-full rounded-md z-0" }: LocationPickerProps) {
  return (
    <div className={`overflow-hidden border border-slate-300 rounded-md ${className}`}>
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={true}
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
