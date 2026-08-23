import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Issue } from '../../types';

// Custom animated heatmap icons based on status
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `
      <div style="
        background-color: ${color}66;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid ${color}AA;
        animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      ">
        <div style="
          background-color: ${color};
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 12px ${color}, 0 0 5px rgba(0,0,0,0.5);
        "></div>
      </div>
      <style>
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(0.95); opacity: 1; }
        }
      </style>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24]
  });
};

const icons = {
  'Submitted': createCustomIcon('#ef4444'),   // Red
  'In Progress': createCustomIcon('#eab308'), // Yellow
  'Resolved': createCustomIcon('#22c55e')     // Green
};

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
        scrollWheelZoom={true}
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
            icon={icons[issue.status as keyof typeof icons] || icons['Submitted']}
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
