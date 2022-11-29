const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//Load env variables
dotenv.config({path: './config/config.env'});


//load model
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

//Read json file
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'));

//Import into DB
const importData = async ()=>{
    try{
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        console.log('Data seeded'.green.inverse);
        process.exit();
    }
    catch(err){
        console.log(err.red);
    }
}
//Delete data
const deleteData = async ()=>{
    try{
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log('Data deleted'.red.inverse);
        process.exit();
    }
    catch(err){
        console.log(err.red);
    }
}

if (process.argv[2]==='-i'){
    importData()
}
else if (process.argv[2]==='-d'){
    deleteData()
}