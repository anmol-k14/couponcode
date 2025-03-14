const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const couponrouter = require('./routes/coupon.routes');
const connect = require('./db/db');
require('dotenv').config();

connect();

const app = express();
const PORT = process.env.PORT || 5000;



var corsOptions = {
    origin: process.env.FRONTENDURL,
    optionsSuccessStatus:200,
};

// Middleware

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());


app.set('trust proxy', true);


// Routes

app.use('/api/coupons',couponrouter);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
