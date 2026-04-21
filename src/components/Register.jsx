import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
const [formData, setFormData] = useState({
name: '',
email: '',
username: '',
password: '',
confirmPassword: ''
});

const [localError, setLocalError] = useState('');
const navigate = useNavigate();
const { register, loading, error } = useAuth();

const handleChange = (e) => {
const { name, value } = e.target;
setFormData(prev => ({
...prev,
[name]: value
}));
setLocalError('');
};

const handleSubmit = async (e) => {
e.preventDefault();
setLocalError('');


if (!formData.name.trim() || !formData.email.trim() || 
    !formData.username.trim() || !formData.password.trim()) {
  setLocalError('All fields are required');
  return;
}

if (formData.password !== formData.confirmPassword) {
  setLocalError('Passwords do not match');
  return;
}

if (formData.password.length < 6) {
  setLocalError('Password must be at least 6 characters');
  return;
}

try {
  await register(
    formData.name,
    formData.email,
    formData.username,
    formData.password
  );
  navigate('/');
} catch (err) {
  setLocalError(err.message || 'Registration failed');
}


};

return ( <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 px-4">

  {/* Card */}
  <div className="w-full max-w-md backdrop-blur-xl bg-white/90 shadow-2xl rounded-2xl p-8 border border-white/20">

    {/* Header */}
    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-1">
        Create Account 🚀
      </h1>
      <p className="text-gray-500 text-sm">
        Join and start collaborating in real-time
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

      {/* Name */}
      <div>
        <label className="text-sm font-semibold text-gray-600">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          disabled={loading}
          className="w-full mt-1 px-4 py-2 text-black rounded-lg border border-gray-300 bg-white/80 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200"
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-semibold text-gray-600">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          disabled={loading}
          className="w-full mt-1 px-4 py-2 text-black rounded-lg border border-gray-300 bg-white/80 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200"
        />
      </div>

      {/* Username */}
      <div>
        <label className="text-sm font-semibold text-gray-600">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="johndoe123"
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
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          disabled={loading}
          className="w-full mt-1 px-4 py-2 text-black rounded-lg border border-gray-300 bg-white/80 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label className="text-sm font-semibold text-gray-600">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
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
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>

    {/* Divider */}
    <div className="flex items-center my-6">
      <div className="flex-1 h-px bg-gray-300" />
      <span className="px-3 text-sm text-gray-400">or</span>
      <div className="flex-1 h-px bg-gray-300" />
    </div>

    {/* Login Link */}
    <p className="text-center text-sm text-gray-600">
      Already have an account?{' '}
      <Link
        to="/login"
        className="text-blue-600 font-semibold hover:underline"
      >
        Sign In
      </Link>
    </p>

  </div>
</div>


);
};

export default Register;
