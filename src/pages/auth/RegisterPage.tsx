import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { Eye, EyeOff } from 'lucide-react';

export function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call for frontend prototype
    setTimeout(() => {
      setIsLoading(false);
      navigate('/citizen/dashboard');
    }, 1000);
  };

  return (
    <div className="flex flex-col justify-center min-h-[calc(100vh-130px)] py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-3xl font-extrabold text-center text-slate-900">
          Create a Citizen Account
        </h2>
        <p className="mt-2 text-sm text-center text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Log in instead
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent className="pt-8">
            <form className="space-y-6" onSubmit={handleRegister}>
              <Input 
                label="Full Name" 
                type="text" 
                autoComplete="name" 
                required 
              />

              <Input 
                label="Email address" 
                type="email" 
                autoComplete="email" 
                required 
              />
              
              <Input 
                label="Password" 
                type={showPassword ? 'text' : 'password'} 
                autoComplete="new-password" 
                required 
                helperText="Must be at least 8 characters."
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-500 focus:outline-none focus:text-slate-500"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                }
              />

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="terms" className="block ml-2 text-sm text-slate-900">
                  I agree to the{' '}
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Create Account
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
