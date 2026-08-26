import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'CITIZEN' | 'AUTHORITY' | 'MODERATOR'>('CITIZEN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call for the frontend prototype
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'CITIZEN') {
        navigate('/citizen/feed');
      } else if (role === 'AUTHORITY') {
        navigate('/authority/dashboard');
      } else {
        navigate('/moderator/queue');
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8 bg-dark-bg text-white font-sans selection:bg-accent/30">
      
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-slide-down">
        <h2 className="mt-6 text-4xl font-bold tracking-tight text-center bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="mt-3 text-base text-center text-zinc-400">
          New to UbiqLoupe?{' '}
          <Link to="/register" className="font-medium text-accent hover:text-accent-hover transition-colors">
            Create an account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="bg-dark-card border border-dark-border rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          
          <div className="flex p-1 space-x-1 bg-black/40 rounded-xl mb-8 border border-dark-border">
            <button
              className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                role === 'CITIZEN' 
                  ? 'bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd text-white shadow-lg' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
              onClick={() => setRole('CITIZEN')}
            >
              Citizen
            </button>
            <button
              className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                role === 'AUTHORITY' 
                  ? 'bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd text-white shadow-lg' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
              onClick={() => setRole('AUTHORITY')}
            >
              Authority
            </button>
            <button
              className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                role === 'MODERATOR' 
                  ? 'bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd text-white shadow-lg' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
              onClick={() => setRole('MODERATOR')}
            >
              Moderator
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-zinc-400 text-sm font-medium mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-dark-border text-white p-4 rounded-xl font-sans text-base focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all placeholder:text-zinc-600"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="block text-zinc-400 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-dark-border text-white p-4 pr-12 rounded-xl font-sans text-base focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all placeholder:text-zinc-600"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="w-5 h-5 rounded border-dark-border bg-black/20 text-accent focus:ring-accent focus:ring-offset-dark-bg cursor-pointer"
                />
                <label htmlFor="remember-me" className="block ml-3 text-sm text-zinc-400 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-accent hover:text-accent-hover transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd text-white border-none px-6 py-4 rounded-xl font-bold text-base cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(139,92,246,0.4)] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
