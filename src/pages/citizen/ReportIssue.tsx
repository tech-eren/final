import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Sparkles, Upload, CheckCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { issueService } from '../../services/mock/issueService';
import { useToast } from '../../context/ToastContext';


const ISSUE_CATEGORIES = [
  'Pothole',
  'Road Damage',
  'Garbage Accumulation',
  'Broken Streetlight',
  'Water Leakage',
  'Drainage Blockage',
  'Flooding',
  'Fallen Tree',
  'Traffic Signal',
  'Illegal Dumping',
  'Other'
];

import { LocationPicker } from '../../components/map/LocationPicker';

export function ReportIssue() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    category: 'Other',
  });

  const [position, setPosition] = useState<[number, number]>([24.8333, 92.7789]);
  const [imageUploaded, setImageUploaded] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSimulateAI = () => {
    if (!imageUploaded) {
      addToast({ title: 'Please upload an image first', type: 'warning' });
      return;
    }
    
    setIsAnalyzing(true);
    // Simulate AI delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setFormData(prev => ({
        ...prev,
        title: 'Large Pothole Detected',
        description: 'AI Analysis: Deep surface depression detected on asphalt road. Estimated hazard level: High.',
        category: 'Road Damage'
      }));
      addToast({ 
        title: 'AI Analysis Complete', 
        message: 'Form automatically populated based on image contents.',
        type: 'success' 
      });
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await issueService.submitIssue({
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        location: { address: formData.address, latitude: position[0], longitude: position[1] }
      });
      
      addToast({
        title: 'Issue Reported Successfully',
        message: 'Your report has been submitted to the local authorities.',
        type: 'success'
      });
      
      navigate('/citizen/dashboard');
    } catch (error) {
      addToast({ title: 'Failed to submit issue', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Report an Issue</h1>
        <p className="text-sm text-slate-500">Help us improve the city by reporting infrastructure problems.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Photo & AI */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-slate-900 flex items-center">
              <Camera className="w-5 h-5 mr-2 text-primary-600" />
              1. Photo Evidence
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${imageUploaded ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:bg-slate-50'}`}
              onClick={() => setImageUploaded(true)}
            >
              {imageUploaded ? (
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-12 h-12 text-primary-500 mb-2" />
                  <p className="text-sm font-medium text-primary-700">Image attached successfully</p>
                  <p className="text-xs text-primary-500 mt-1">Click to change</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>

            <Button 
              type="button" 
              variant="secondary" 
              className="w-full"
              onClick={handleSimulateAI}
              isLoading={isAnalyzing}
              icon={Sparkles}
            >
              Auto-fill with AI
            </Button>
            <p className="text-xs text-center text-slate-500">Let our AI analyze the photo and fill out the details for you.</p>
          </CardContent>
        </Card>

        {/* Step 2: Details */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-slate-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary-600" />
              2. Issue Details
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              label="Issue Title" 
              name="title"
              placeholder="E.g., Large pothole on Main St."
              required
              value={formData.title}
              onChange={handleInputChange}
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {ISSUE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleInputChange}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Provide additional details..."
              ></textarea>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Location */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-slate-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary-600" />
              3. Location
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              label="Address or Cross Street" 
              name="address"
              placeholder="123 Main St..."
              required
              value={formData.address}
              onChange={handleInputChange}
            />
            <div className="pt-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Pinpoint exact location
              </label>
              <LocationPicker position={position} onChange={setPosition} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="ghost" onClick={() => navigate('/citizen/dashboard')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Submit Report
          </Button>
        </div>
      </form>
    </div>
  );
}
