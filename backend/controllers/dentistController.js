const Dentist = require('../models/Dentist');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getDentists = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const total = await Dentist.countDocuments(query);
    const dentists = await Dentist.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, data: dentists, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

exports.getDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findById(req.params.id);
    if (!dentist) return res.status(404).json({ success: false, message: 'Dentist not found' });
    res.json({ success: true, data: dentist });
  } catch (err) { next(err); }
};

exports.createDentist = async (req, res, next) => {
  try {
    const { email, name, password = 'DentalCare@123', ...rest } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password, role: 'dentist' });
    }
    const dentist = await Dentist.create({ ...rest, name, email, user: user._id });
    user.linkedId = dentist._id;
    user.linkedModel = 'Dentist';
    await user.save();
    res.status(201).json({ success: true, data: dentist });
  } catch (err) { next(err); }
};

exports.updateDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!dentist) return res.status(404).json({ success: false, message: 'Dentist not found' });
    res.json({ success: true, data: dentist });
  } catch (err) { next(err); }
};

exports.deleteDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!dentist) return res.status(404).json({ success: false, message: 'Dentist not found' });
    res.json({ success: true, message: 'Dentist deleted successfully' });
  } catch (err) { next(err); }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const dentist = await Dentist.findOne({ user: req.user.id });
    if (!dentist) return res.status(404).json({ success: false, message: 'Dentist profile not found' });
    res.json({ success: true, data: dentist });
  } catch (err) { next(err); }
};
