import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const DEMOS = [
  { label: 'Admin', email: 'admin@dentalcare.com', password: 'Admin@123', color: 'bg-blue-100 text-blue-700' },
  { label: 'Dentist', email: 'priya@dentalcare.com', password: 'Doctor@123', color: 'bg-teal-100 text-teal-700' },
  { label: 'Patient', email: 'arjun@example.com', password: 'Patient@123', color: 'bg-green-100 text-green-700' },
];

export default function Login() {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const user = await login(form.email, form.password);
      // Use full page redirect so AuthContext re-initializes cleanly from localStorage
      if (user.role === 'admin') window.location.href = '/admin/dashboard';
      else if (user.role === 'dentist') window.location.href = '/dentist/dashboard';
      else window.location.href = '/patient/dashboard';
    } catch {}
  };

  const fillDemo = (d) => setForm({ email: d.email, password: d.password });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-blue-200">
            🦷
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome to DentalCare</h1>
          <p className="text-slate-500 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                className={`input ${errors.email ? 'border-red-400' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className={`input pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPw(p => !p)}
                >
                  {showPw ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-2.5 text-base"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">Register</Link>
          </div>
        </div>

        {/* Quick Demo Access */}
        <div className="mt-6">
          <p className="text-xs text-center text-slate-400 mb-3 font-medium uppercase tracking-wide">Quick Demo Access</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {DEMOS.map(d => (
              <button
                key={d.label}
                onClick={() => fillDemo(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${d.color} hover:opacity-80 transition-opacity`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-center text-slate-300 mt-2">Click a role to auto-fill credentials</p>
        </div>
      </div>
    </div>
  );
}
