import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function PatientProfile() {
  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/patients/me').then(r => { setPatient(r.data.data); setForm({ ...r.data.data, dob: r.data.data.dob?.split('T')[0]||'', allergies: r.data.data.allergies?.join(', ')||'' }); }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, allergies: form.allergies ? form.allergies.split(',').map(s=>s.trim()) : [] };
      const { data } = await api.put(`/patients/${patient._id}`, payload);
      setPatient(data.data); toast.success('Profile updated');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner text="Loading profile..." />;
  if (!patient) return <div className="card text-center text-slate-400">Profile not found</div>;

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="text-2xl font-bold text-slate-800">My Profile</h1><p className="text-slate-500 text-sm">{patient.patientId}</p></div>
      <div className="card">
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="label">Full Name</label><input className="input" value={form.name||''} onChange={set('name')} /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone||''} onChange={set('phone')} /></div>
          <div><label className="label">Email</label><input type="email" className="input" value={form.email||''} onChange={set('email')} /></div>
          <div><label className="label">Date of Birth</label><input type="date" className="input" value={form.dob||''} onChange={set('dob')} /></div>
          <div><label className="label">Gender</label><select className="input" value={form.gender||'Male'} onChange={set('gender')}>{['Male','Female','Other'].map(g=><option key={g}>{g}</option>)}</select></div>
          <div><label className="label">Blood Group</label><select className="input" value={form.bloodGroup||''} onChange={set('bloodGroup')}><option value="">Select</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=><option key={b}>{b}</option>)}</select></div>
          <div className="md:col-span-2"><label className="label">Address</label><textarea className="input" rows={2} value={form.address||''} onChange={set('address')} /></div>
          <div><label className="label">Allergies (comma separated)</label><input className="input" value={form.allergies||''} onChange={set('allergies')} /></div>
          <div><label className="label">Current Medications</label><input className="input" value={form.currentMedications||''} onChange={set('currentMedications')} /></div>
          <div className="md:col-span-2"><label className="label">Medical History</label><textarea className="input" rows={3} value={form.medicalHistory||''} onChange={set('medicalHistory')} /></div>
          <div className="md:col-span-2 flex justify-end border-t pt-4">
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Update Profile'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
