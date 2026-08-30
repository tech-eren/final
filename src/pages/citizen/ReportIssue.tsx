import { useState, useRef } from 'react';
import { UploadCloud, MapPin, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { LocationPicker } from '../../components/map/LocationPicker';
import { useToast } from '../../context/ToastContext';
import { useUser } from '../../context/UserContext';
import { aiService } from '../../services/aiService';
import { issueService } from '../../services/issueService';

export function ReportIssue() {
  const { user } = useUser();
  const [location, setLocation] = useState<[number, number]>([24.83, 92.79]); // Default to Silchar, Assam
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAutoFill = async () => {
    if (!selectedFile) {
      addToast({ title: 'Error', message: 'Please upload an image first.', type: 'error' });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await aiService.analyzeImage(selectedFile);
      
      if (result.hasIssue) {
        if (result.title) setTitle(result.title);
        if (result.description) setDescription(result.description);
        if (result.category) {
          const categoryLower = result.category.toLowerCase();
          if (['infrastructure', 'safety', 'noise', 'other'].includes(categoryLower)) {
            setCategory(categoryLower);
          } else {
             setCategory('other');
          }
        }
        if (result.severity) {
          setSeverity(result.severity);
        } else {
          setSeverity('medium');
        }
        addToast({ title: 'Success', message: 'Form auto-filled by AI.', type: 'success' });
      } else {
        addToast({ title: 'No Issue Detected', message: 'The AI could not identify a civic issue in the image.', type: 'warning' });
      }
    } catch (error) {
      addToast({ title: 'AI Error', message: 'Failed to analyze the image.', type: 'error' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.latitude, position.coords.longitude]);
          addToast({ title: 'Location Detected', message: 'Map updated to your current location.', type: 'success' });
          setIsDetectingLocation(false);
        },
        (error) => {
          console.error(error);
          addToast({ title: 'Location Error', message: 'Failed to get your location.', type: 'error' });
          setIsDetectingLocation(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      addToast({ title: 'Error', message: 'Geolocation is not supported by your browser.', type: 'error' });
      setIsDetectingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category) {
      addToast({ title: 'Validation Error', message: 'Please fill in all required fields including category.', type: 'error' });
      return;
    }
    
    try {
      let finalImageUrl = previewUrl || '';
      
      // Convert to base64 so it persists in localStorage (blob URLs expire)
      if (selectedFile) {
        finalImageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(selectedFile);
        });
      }

      await issueService.submitIssue({
        title,
        description,
        category: category as any,
        severity: severity as any,
        imageUrl: finalImageUrl,
        reportedBy: user.id,
        location: {
          latitude: location[0],
          longitude: location[1],
          address: address || 'Unknown Location'
        }
      });
      addToast({ title: 'Report Submitted', message: 'Your report has been successfully filed.', type: 'success' });
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setSeverity('medium');
      setSelectedFile(null);
      setPreviewUrl(null);
      setAddress('');
    } catch (error) {
      addToast({ title: 'Error', message: 'Failed to submit report.', type: 'error' });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-10 animate-slide-down">
        <span className="block text-sm font-semibold uppercase tracking-widest text-accent mb-2">New Report</span>
        <h1 className="m-0 text-4xl font-bold tracking-tight mb-2">File a Report</h1>
        <p className="text-zinc-400 text-lg m-0">Help improve the community by reporting an issue.</p>
      </div>
      
      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 backdrop-blur-md animate-fade-in max-w-2xl mx-auto" style={{ animationDelay: '0.1s' }}>
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Photo Evidence */}
          <div>
            <label className="block text-zinc-400 text-sm mb-2">1. Photo Evidence</label>
            <input 
              type="file" 
              accept="image/*"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            {!previewUrl ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-dark-border rounded-xl p-8 text-center cursor-pointer transition-all hover:border-accent group bg-black/20"
              >
                <UploadCloud className="w-10 h-10 text-zinc-500 mx-auto mb-4 group-hover:text-accent transition-colors" />
                <p className="m-0 text-white font-medium mb-1">Click to upload photos/videos</p>
                <p className="m-0 text-zinc-400 text-sm">PNG, JPG, GIF up to 10MB</p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-dark-border bg-black/40 mb-3 group">
                <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            )}
            
          </div>

          {/* Issue Details */}
          <div>
            <div className="flex items-center gap-2 mb-2 mt-8 border-t border-dark-border pt-6">
              <label className="block text-zinc-400 text-sm m-0">2. Issue Details</label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-zinc-500 text-xs mb-1">Issue Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/20 border border-dark-border text-white p-3 rounded-xl font-sans text-base focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all"
                  placeholder="E.g., Large pothole on Main St." 
                />
              </div>
              
              <div>
                <label className="block text-zinc-500 text-xs mb-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full bg-black/20 border border-dark-border p-3 rounded-xl font-sans text-base focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all appearance-none cursor-pointer ${category === '' ? 'text-zinc-500' : 'text-white'}`}
                >
                  <option value="" disabled hidden>Select Category</option>
                  <option value="infrastructure" className="bg-dark-bg text-white">Infrastructure</option>
                  <option value="safety" className="bg-dark-bg text-white">Safety</option>
                  <option value="noise" className="bg-dark-bg text-white">Noise Complaint</option>
                  <option value="other" className="bg-dark-bg text-white">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-500 text-xs mb-1">Severity</label>
                <select 
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full bg-black/20 border border-dark-border text-white p-3 rounded-xl font-sans text-base focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all appearance-none cursor-pointer"
                >
                  <option value="low" className="bg-dark-bg text-white">Low - Minor issue with limited impact</option>
                  <option value="medium" className="bg-dark-bg text-white">Medium - Noticeable issue affecting usability</option>
                  <option value="high" className="bg-dark-bg text-white">High - Potentially dangerous or urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-500 text-xs mb-1">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black/20 border border-dark-border text-white p-3 rounded-xl font-sans text-base focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all min-h-[120px] resize-y"
                  placeholder="Provide additional details..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center justify-between mt-8 border-t border-dark-border pt-6 mb-4">
              <label className="block text-zinc-400 text-sm m-0">3. Location</label>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isDetectingLocation}
                className="flex items-center gap-2 text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
              >
                {isDetectingLocation ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                Detect my location
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-zinc-500 text-xs mb-1">Address or Cross Street</label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-black/20 border border-dark-border text-white p-3 rounded-xl font-sans text-base focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all placeholder:text-zinc-600"
                placeholder="123 Main St..." 
              />
            </div>
            
            <LocationPicker 
              position={location} 
              onChange={setLocation} 
              className="h-[300px] w-full rounded-xl z-0 border border-dark-border overflow-hidden shadow-inner bg-black/20"
            />
            <p className="mt-2 text-xs text-zinc-500 text-center">Pinpoint exact location by dragging the marker or clicking on the map.</p>
          </div>

          <div className="pt-6 flex justify-end gap-4 border-t border-dark-border">
             <button type="button" className="px-6 py-3 rounded-xl font-medium text-zinc-400 hover:text-white transition-colors">
               Cancel
             </button>
             <button type="submit" className="bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd text-white border-none px-8 py-3 rounded-xl font-semibold text-base cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(139,92,246,0.4)] transition-all">
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
