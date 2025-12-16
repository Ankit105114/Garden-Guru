const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gardenguru')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/plants', require('./routes/plants'));
app.use('/api/garden', require('./routes/garden'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/resources', require('./routes/resources'));

app.get('/', (req, res) => {
    res.send('GardenGuru API Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
