import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Issue } from '../../types';

// Fix for default Leaflet icon paths in Vite
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

// Default center: Silchar, India
const DEFAULT_CENTER: [number, number] = [24.8333, 92.7789];

interface MapViewerProps {
  issues: Issue[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export function MapViewer({ 
  issues, 
  center = DEFAULT_CENTER, 
  zoom = 13,
  className = "h-96 w-full rounded-xl z-0" 
}: MapViewerProps) {
  
  // Custom marker icon creation could go here
  
  return (
    <div className={`overflow-hidden shadow-sm border border-slate-200 ${className}`}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {issues.map((issue) => (
          <Marker 
            key={issue.id} 
            position={[issue.location.latitude, issue.location.longitude]}
          >
            <Popup>
              <div className="p-1 max-w-xs">
                <h3 className="font-bold text-sm text-slate-900 mb-1">{issue.category}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 mb-2">{issue.description}</p>
                
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium capitalize
                    ${issue.status === 'Submitted' ? 'bg-red-100 text-red-800' : 
                      issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}`
                }>
                  {issue.status}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
