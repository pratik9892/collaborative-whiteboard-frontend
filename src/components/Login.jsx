import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [localError, setLocalError] = useState('');
const navigate = useNavigate();
const { login, loading, error } = useAuth();

const handleSubmit = async (e) => {
e.preventDefault();
setLocalError('');


if (!email.trim() || !password.trim()) {
  setLocalError('Email and password are required');
  return;
}

try {
  await login(email, password);
  navigate('/');
} catch (err) {
  setLocalError(err.message || 'Login failed');
}


};

return ( <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 px-4">


  {/* Card */}
  <div className="w-full max-w-md backdrop-blur-xl bg-white/90 shadow-2xl rounded-2xl p-8 border border-white/20">
    
    {/* Header */}
    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-1">
        Welcome Back 👋
      </h1>
      <p className="text-gray-500 text-sm">
        Sign in to continue collaborating
      </p>
    </div>

    {/* Error */}
    {(localError || error) && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm animate-pulse">
        {localError || error}
      </div>
    )}

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Email */}
      <div>
        <label className="text-sm font-semibold text-gray-600">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setLocalError('');
          }}
          placeholder="you@example.com"
          disabled={loading}
          className="w-full mt-1 px-4 py-2 text-black rounded-lg border border-gray-300 bg-white/80 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200"
        />
      </div>

      {/* Password */}
      <div>
        <label className="text-sm font-semibold text-gray-600">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setLocalError('');
          }}
          placeholder="••••••••"
          disabled={loading}
          className="w-full mt-1 px-4 py-2 text-black rounded-lg border border-gray-300 bg-white/80 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200"
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 rounded-lg 
        shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] 
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>

    {/* Divider */}
    <div className="flex items-center my-6">
      <div className="flex-1 h-px bg-gray-300" />
      <span className="px-3 text-sm text-gray-400">or</span>
      <div className="flex-1 h-px bg-gray-300" />
    </div>

    {/* Register */}
    <p className="text-center text-sm text-gray-600">
      Don’t have an account?{' '}
      <Link
        to="/register"
        className="text-blue-600 font-semibold hover:underline"
      >
        Sign Up
      </Link>
    </p>

  </div>
</div>


);
};

export default Login;
