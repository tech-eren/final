import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { issueService } from '../../services/mock/issueService';
import type { Issue } from '../../types';
import { MapPin } from 'lucide-react';

// Custom icons based on status
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

export function Map() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'Active' | 'All'>('Active');

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const data = await issueService.getAllIssues();
        setIssues(data);
      } catch (e) {
        console.error("Failed to fetch issues for map", e);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const [userLocation, setUserLocation] = useState<[number, number]>([24.8333, 92.7789]); // Silchar fallback

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => console.warn("Location denied, using default for map.")
      );
    }
  }, []);

  const displayedIssues = issues.filter(issue => {
    if (issue.location.latitude === 0 || issue.location.longitude === 0) return false;
    if (filter === 'All') return true;
    return issue.status === 'Submitted' || issue.status === 'In Progress';
  });

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-120px)]">
      <div className="mb-6 flex-shrink-0 animate-slide-down flex justify-between items-end">
        <div>
          <span className="block text-sm font-semibold uppercase tracking-widest text-accent mb-2">Explore</span>
          <h1 className="m-0 text-4xl font-bold tracking-tight mb-2">Map View</h1>
          <p className="text-zinc-400 text-lg m-0">Explore issues reported in your area interactively.</p>
        </div>
        
        <div className="flex gap-4 bg-black/20 p-2 rounded-2xl border border-dark-border">
          <button 
            onClick={() => setFilter('Active')}
            className={`px-6 py-2 rounded-xl font-medium transition-all ${
              filter === 'Active' 
                ? 'bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd text-white shadow-[0_4px_12px_rgba(139,92,246,0.4)]' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Active Issues
          </button>
          <button 
            onClick={() => setFilter('All')}
            className={`px-6 py-2 rounded-xl font-medium transition-all ${
              filter === 'All' 
                ? 'bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd text-white shadow-[0_4px_12px_rgba(139,92,246,0.4)]' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Issues
          </button>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex-1 relative animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-card/80 z-[1000] backdrop-blur-sm">
             <div className="w-8 h-8 border-4 border-accent rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : null}
        
        <MapContainer 
          key={`${userLocation[0]}-${userLocation[1]}`} // Force re-render when location resolves
          center={userLocation} 
          zoom={13} 
          className="w-full h-full z-10"
        >
          {/* Using a standard OpenStreetMap tile layout */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {displayedIssues.map((issue) => (
            <Marker 
              key={issue.id} 
              position={[issue.location.latitude, issue.location.longitude]}
              icon={icons[issue.status as keyof typeof icons] || icons['Submitted']}
            >
              <Popup className="custom-popup">
                <div className="p-1">
                  <h3 className="font-bold text-gray-800 m-0 mb-1">{issue.category}</h3>
                  <p className="text-sm font-semibold uppercase text-accent m-0 mb-2">{issue.status}</p>
                  <p className="text-sm text-gray-700 m-0 line-clamp-2">{issue.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
