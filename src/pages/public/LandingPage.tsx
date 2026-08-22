import { Link } from 'react-router-dom';
import { Camera, MapPin, Wrench, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-50">
        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              <span className="block">Report Civic Issues.</span>
              <span className="block text-primary-600">Improve Your City.</span>
            </h1>
            <p className="max-w-md mx-auto mt-3 text-base text-slate-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
              A modern, AI-powered platform to report, track, and resolve public infrastructure problems in your community faster than ever before.
            </p>
            <div className="max-w-md mx-auto mt-5 sm:flex sm:justify-center md:mt-8 gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Reporting <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="secondary" size="lg" className="w-full mt-3 sm:w-auto sm:mt-0">
                  Explore Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-16 bg-white lg:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">How UbiqLoupe Works</h2>
            <p className="max-w-2xl mx-auto mt-4 text-xl text-slate-500">
              Three simple steps to make your neighborhood better.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 text-white rounded-full bg-primary-100 mb-4">
                  <Camera className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">1. Snap a Photo</h3>
                <p className="text-slate-500">
                  See a pothole, broken streetlight, or graffiti? Snap a quick photo with your phone. Our AI will help categorize it automatically.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 text-white rounded-full bg-primary-100 mb-4">
                  <MapPin className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">2. Pin the Location</h3>
                <p className="text-slate-500">
                  Confirm the location on our interactive map. We'll automatically route the issue to the correct local authority department.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 text-white rounded-full bg-primary-100 mb-4">
                  <Wrench className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">3. Track Resolution</h3>
                <p className="text-slate-500">
                  Get real-time updates as authorities assign crews, schedule work, and resolve the issue you reported.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
