const Invoice = require('../models/Invoice');
const Patient = require('../models/Patient');

exports.getInvoices = async (req, res, next) => {
  try {
    const { patient, paymentStatus, page = 1, limit = 10 } = req.query;
    const query = {};
    if (patient) query.patient = patient;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (req.user.role === 'patient') {
      const pat = await Patient.findOne({ user: req.user.id });
      if (pat) query.patient = pat._id;
    }
    const total = await Invoice.countDocuments(query);
    const invoices = await Invoice.find(query)
      .populate('patient', 'name patientId phone')
      .populate('treatment', 'treatmentType diagnosis')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, data: invoices, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const inv = await Invoice.findById(req.params.id).populate('patient').populate('treatment');
    if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: inv });
  } catch (err) { next(err); }
};

exports.createInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json({ success: true, data: invoice });
  } catch (err) { next(err); }
};

exports.updateInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('patient', 'name patientId').populate('treatment', 'treatmentType');
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (err) { next(err); }
};

exports.deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, message: 'Invoice deleted' });
  } catch (err) { next(err); }
};

exports.markAsPaid = async (req, res, next) => {
  try {
    const { paymentMethod } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: 'Paid', paidAmount: undefined, paidDate: new Date(), paymentMethod },
      { new: true }
    ).populate('patient', 'name patientId');
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    invoice.paidAmount = invoice.total;
    await invoice.save();
    res.json({ success: true, data: invoice });
  } catch (err) { next(err); }
};
