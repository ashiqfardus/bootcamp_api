const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
const path = require('path');

//Load env vars
dotenv.config({path:'./config/config.env'});

//connect to db
connectDB();

//Route files
const bootcamp = require('./routes/bootcamps');
const course = require('./routes/courses');
const auth = require('./routes/auth');

const app = express();

//body parser
app.use(express.json());

//dev logging middleware
if (process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

//File upload
app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routers
app.use('/api/v1/bootcamps', bootcamp);
app.use('/api/v1/courses', course);
app.use('/api/v1/auth', auth);

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