const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const path = require('path');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

//Load env vars
dotenv.config({path:'./config/config.env'});

//connect to db
connectDB();

//Route files
const bootcamp = require('./routes/bootcamps');
const course = require('./routes/courses');
const auth = require('./routes/auth');
const user = require('./routes/users');
const reviews = require('./routes/reviews');
const {query} = require("express");

const app = express();

//body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

//dev logging middleware
if (process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

//File upload
app.use(fileupload());
// To remove data using these defaults:
app.use(mongoSanitize());
//XSS protection
app.use(helmet());

//prevent XSS attacks
app.use(xss());

//Rate limiting
const limiter = rateLimit({
   windowMs:10*60*1000, //10 mins
   max:1000
});

app.use(limiter);

//PREVENT HTTP PARAM pollution
app.use(hpp());

//Enable CORS
app.use(cors());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routers
app.use('/api/v1/bootcamps', bootcamp);
app.use('/api/v1/courses', course);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server  = app.listen(PORT, ()=>{
    console.log(`Server connected to ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold);
});

//Handle unhandled promise rejections
process.on('unhandledRejection', (err)=>{
    console.log(`Error: ${err.message}`.red);

    //close server & exit process
    server.close(()=>process.exit(1));
})