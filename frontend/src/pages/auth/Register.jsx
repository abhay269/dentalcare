import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', role: 'patient' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const user = await register({ name: form.name, email: form.email, password: form.password, phone: form.phone, role: form.role });
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'dentist') navigate('/dentist/dashboard');
      else navigate('/patient/dashboard');
    } catch {}
  };

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-blue-200">🦷</div>
          <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
          <p className="text-slate-500 mt-1">Join DentalCare today</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input className={`input ${errors.name ? 'border-red-400' : ''}`} placeholder="John Doe" value={form.name} onChange={set('name')} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className={`input ${errors.email ? 'border-red-400' : ''}`} placeholder="you@example.com" value={form.email} onChange={set('email')} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" placeholder="9876543210" value={form.phone} onChange={set('phone')} />
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input" value={form.role} onChange={set('role')}>
                <option value="patient">Patient</option>
                <option value="admin">Admin / Receptionist</option>
              </select>
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className={`input ${errors.password ? 'border-red-400' : ''}`} placeholder="Min. 6 characters" value={form.password} onChange={set('password')} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input type="password" className={`input ${errors.confirmPassword ? 'border-red-400' : ''}`} placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-2.5 text-base">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
