// imports express framework 
const express = require('express');
// creates express app 
const app = express();

require('dotenv').config();
app.use(express.json());


const cors = require('cors');
const cafeRoutes = require('./routes/cafes');
const employeeRoutes = require('./routes/employees');

app.use(cors());
app.use('/cafes', cafeRoutes);
app.use('/employees', employeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));