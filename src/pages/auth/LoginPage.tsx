import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';

export function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'CITIZEN' | 'AUTHORITY'>('CITIZEN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call for the frontend prototype
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'CITIZEN') {
        navigate('/citizen/dashboard');
      } else {
        navigate('/authority/dashboard');
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col justify-center min-h-[calc(100vh-130px)] py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-3xl font-extrabold text-center text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-center text-slate-600">
          Or{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <div className="flex p-1 space-x-1 bg-slate-100 rounded-lg">
              <button
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  role === 'CITIZEN' 
                    ? 'bg-white text-slate-900 shadow' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => setRole('CITIZEN')}
              >
                Citizen
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  role === 'AUTHORITY' 
                    ? 'bg-white text-slate-900 shadow' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => setRole('AUTHORITY')}
              >
                Authority
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleLogin}>
              <Input 
                label="Email address" 
                type="email" 
                autoComplete="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <Input 
                label="Password" 
                type="password" 
                autoComplete="current-password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="remember-me" className="block ml-2 text-sm text-slate-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Sign in
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
