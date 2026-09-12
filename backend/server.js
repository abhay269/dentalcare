const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ 
  origin: ['http://localhost:5173', 'https://dentalcare-m602z0aa8-creepy2.vercel.app'], 
  credentials: true 
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/dentists', require('./routes/dentists'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/treatments', require('./routes/treatments'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

app.get('/', (req, res) => res.json({ message: 'DentalCare API Running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
