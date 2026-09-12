import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TREATMENTS = ['Teeth Cleaning','Filling','Root Canal','Extraction','Braces','Crown','Whitening','Consultation','Gum Treatment','Implant','X-Ray'];

export default function BookAppointment() {
  const navigate = useNavigate();
  const [dentists, setDentists] = useState([]);
  const [patient, setPatient] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({ dentist:'', date:'', timeSlot:'', treatmentType:'', notes:'' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/dentists', { params: { limit: 50 } }).then(r => setDentists(r.data.data));
    api.get('/patients/me').then(r => setPatient(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.dentist && form.date) {
      setLoadingSlots(true);
      api.get('/appointments/slots', { params: { dentistId: form.dentist, date: form.date } })
        .then(r => setSlots(r.data.data)).catch(() => setSlots([]))
        .finally(() => setLoadingSlots(false));
    } else { setSlots([]); }
  }, [form.dentist, form.date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patient) { toast.error('Patient profile not found'); return; }
    if (!form.timeSlot) { toast.error('Please select a time slot'); return; }
    setSaving(true);
    try {
      await api.post('/appointments', { ...form, patient: patient._id });
      toast.success('Appointment booked successfully!');
      navigate('/patient/appointments');
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed'); } finally { setSaving(false); }
  };

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const selectedDentist = dentists.find(d => d._id === form.dentist);

  return (
    <div className="space-y-6 max-w-2xl">
      <div><h1 className="text-2xl font-bold text-slate-800">Book Appointment</h1><p className="text-slate-500 text-sm">Schedule a visit with one of our dentists</p></div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Dentist */}
        <div className="card">
          <h2 className="font-semibold text-slate-700 mb-4">1. Select Dentist</h2>
          <div className="grid gap-3">
            {dentists.map(d => (
              <label key={d._id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                form.dentist === d._id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input type="radio" name="dentist" value={d._id} className="sr-only" onChange={set('dentist')} />
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-lg">{d.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-sm text-slate-500">{d.specialization} · {d.experience} years exp.</p>
                </div>
                {form.dentist === d._id && <span className="ml-auto text-primary-600 font-bold">✓</span>}
              </label>
            ))}
          </div>
        </div>

        {/* Step 2: Select Date & Time */}
        <div className="card">
          <h2 className="font-semibold text-slate-700 mb-4">2. Select Date & Time</h2>
          <div className="space-y-4">
            <div><label className="label">Appointment Date *</label>
              <input required type="date" className="input" value={form.date} onChange={set('date')} min={new Date().toISOString().split('T')[0]} /></div>
            {form.dentist && form.date && (
              <div>
                <label className="label">Available Time Slots</label>
                {loadingSlots ? <p className="text-sm text-slate-400">Loading slots...</p> :
                  slots.length === 0 ? <p className="text-sm text-red-500">No slots available for this date. Try another date.</p> : (
                    <div className="grid grid-cols-4 gap-2">
                      {slots.map(s => (
                        <button key={s} type="button" onClick={() => setForm(p => ({ ...p, timeSlot: s }))}
                          className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all ${
                            form.timeSlot === s ? 'border-primary-500 bg-primary-600 text-white' : 'border-gray-200 hover:border-primary-300'
                          }`}>{s}</button>
                      ))}
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Treatment & Notes */}
        <div className="card">
          <h2 className="font-semibold text-slate-700 mb-4">3. Treatment & Notes</h2>
          <div className="space-y-4">
            <div><label className="label">Treatment Type</label>
              <select className="input" value={form.treatmentType} onChange={set('treatmentType')}>
                <option value="">Select treatment...</option>
                {TREATMENTS.map(t => <option key={t}>{t}</option>)}
              </select></div>
            <div><label className="label">Notes / Symptoms</label><textarea className="input" rows={3} placeholder="Describe your issue or any special requirements..." value={form.notes} onChange={set('notes')} /></div>
          </div>
        </div>

        {/* Summary */}
        {form.dentist && form.date && form.timeSlot && (
          <div className="card bg-primary-50 border-primary-200">
            <h3 className="font-semibold text-primary-800 mb-2">Booking Summary</h3>
            <div className="space-y-1 text-sm text-primary-700">
              <p><strong>Dentist:</strong> {selectedDentist?.name} ({selectedDentist?.specialization})</p>
              <p><strong>Date:</strong> {new Date(form.date).toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
              <p><strong>Time:</strong> {form.timeSlot}</p>
              {form.treatmentType && <p><strong>Treatment:</strong> {form.treatmentType}</p>}
            </div>
          </div>
        )}

        <button type="submit" disabled={saving || !form.dentist || !form.date || !form.timeSlot}
          className="btn-primary w-full justify-center py-3 text-base">
          {saving ? 'Booking...' : '📅 Confirm Appointment'}
        </button>
      </form>
    </div>
  );
}
