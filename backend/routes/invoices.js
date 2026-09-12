const express = require('express');
const router = express.Router();
const { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice, markAsPaid } = require('../controllers/invoiceController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(protect, getInvoices).post(protect, authorize('admin'), createInvoice);
router.route('/:id').get(protect, getInvoice).put(protect, authorize('admin'), updateInvoice).delete(protect, authorize('admin'), deleteInvoice);
router.put('/:id/pay', protect, authorize('admin'), markAsPaid);

module.exports = router;
