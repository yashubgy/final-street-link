import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, ArrowLeft } from 'lucide-react';
import { translations } from '../lib/i18n';
import { useAppContext } from '../AppContext';

interface LoginScreenProps {
  onLogin: () => void;
}

let VALID_PASSWORD = 'Yashu@143' ;

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { language } = useAppContext();
  const t = translations[language];
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Yashu_123' && password === VALID_PASSWORD) {
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length === 0) {
      setError('Password cannot be empty');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please retype.');
      return;
    }
    VALID_PASSWORD = newPassword;
    setIsForgotPassword(false);
    setError('');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl">
        {isForgotPassword ? (
          <>
            <button 
              onClick={() => {
                setIsForgotPassword(false);
                setError('');
              }} 
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-6 flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Back to login</span>
            </button>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Reset Password</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Create a new password for Man_meet</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="New Password" 
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-12 text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Confirm Password" 
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-12 text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs font-semibold px-2">{error}</p>
              )}

              <button 
                type="submit" 
                className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold py-4 rounded-2xl mt-4 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 dark:focus:ring-offset-zinc-900 dark:focus:ring-zinc-100"
              >
                Reset Password
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-zinc-900 dark:bg-zinc-100 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <span className="text-3xl">😊</span>
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Welcome Back</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Login to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError('');
                    }}
                    placeholder="Username" 
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Password" 
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-12 text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs font-semibold px-2">{error}</p>
              )}

              <div className="flex justify-end pt-1">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsForgotPassword(true);
                    setError('');
                  }}
                  className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button 
                type="submit" 
                className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold py-4 rounded-2xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 dark:focus:ring-offset-zinc-900 dark:focus:ring-zinc-100 mt-2"
              >
                Sign In
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
