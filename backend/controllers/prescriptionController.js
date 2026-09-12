const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const Dentist = require('../models/Dentist');

exports.getPrescriptions = async (req, res, next) => {
  try {
    const { patient, dentist, page = 1, limit = 10 } = req.query;
    const query = {};
    if (patient) query.patient = patient;
    if (dentist) query.dentist = dentist;
    if (req.user.role === 'dentist') {
      const doc = await Dentist.findOne({ user: req.user.id });
      if (doc) query.dentist = doc._id;
    }
    if (req.user.role === 'patient') {
      const pat = await Patient.findOne({ user: req.user.id });
      if (pat) query.patient = pat._id;
    }
    const total = await Prescription.countDocuments(query);
    const prescriptions = await Prescription.find(query)
      .populate('patient', 'name patientId')
      .populate('dentist', 'name specialization')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, data: prescriptions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

exports.getPrescription = async (req, res, next) => {
  try {
    const p = await Prescription.findById(req.params.id).populate('patient').populate('dentist');
    if (!p) return res.status(404).json({ success: false, message: 'Prescription not found' });
    res.json({ success: true, data: p });
  } catch (err) { next(err); }
};

exports.createPrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.create(req.body);
    res.status(201).json({ success: true, data: prescription });
  } catch (err) { next(err); }
};

exports.updatePrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });
    res.json({ success: true, data: prescription });
  } catch (err) { next(err); }
};

exports.deletePrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });
    res.json({ success: true, message: 'Prescription deleted' });
  } catch (err) { next(err); }
};
