const ErrorResponse =require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');


//@desc     Get all bootcamp
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = asyncHandler(async (req, res, next)=>{
        const bootcamp = await Bootcamp.find();
        res.status(200).json({
            success:true,
            count:bootcamp.length,
            data: bootcamp
        });

});

//@desc     Get single bootcamp
//@route    GET /api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp = asyncHandler(async (req, res, next)=>{
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (bootcamp){
            res.status(200).json({
                success:true,
                data: bootcamp
            });
        }
        else {
            return next(new ErrorResponse(`Resource not found id of ${req.params.id}`, 404));
        }
});

//@desc     Create a bootcamp
//@route    POST /api/v1/bootcamps
//@access   Private
exports.createBootcamp = asyncHandler(async (req, res, next)=>{
       const bootcamp = await Bootcamp.create(req.body);
       res.status(201).json({
           success:true,
           data:bootcamp
       });
});

//@desc     updates a bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   Private
exports.updateBootcamp = asyncHandler(async (req, res, next)=>{
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators:true
        });
        if (bootcamp){
            res.status(201).json({
                success:true,
                data:bootcamp
            })
        }
        else{
            return next(new ErrorResponse(`Resource not found id of ${req.params.id}`, 404));
        }

});

//@desc     deletes a bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next)=>{
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if (bootcamp){
            res.status(201).json({
                success:true,
                data:bootcamp
            })
        }
        else{
            return next(new ErrorResponse(`Resource not found id of ${req.params.id}`, 404));
        }
});

//@desc     get bootcamps within a radius
//@route    GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access   Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next)=>{
    const {zipcode, distance} = req.params;

    //get lat and long
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const long = loc[0].longitude;

    //calc radius
    //Divide distance by radius of earth
    //Earth radius =3963 miles // 6378km
    const radius = distance/3963;

    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: { $centerSphere: [ [ long, lat ], radius ] }}
    });

    res.status(200).json({
        success:true,
        count:bootcamps.length,
        data:bootcamps
    })
});