const ErrorResponse =require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const path = require('path');


//@desc     Get all bootcamp
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = asyncHandler(async (req, res, next)=>{

    res.status(200).json(res.advancedResults);

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
    //Add user to body
    req.body.user = req.user.id;

    //check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({user:req.user.id});

    //id the user is not admin they can add only one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User with ID ${req.user.id} already published a bootcamp`, 400));
    }

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
        let bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp){
            return next(new ErrorResponse(`Resource not found id of ${req.params.id}`, 404));
        }

        //Make sure user is bootcamp owner
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return next(new ErrorResponse(`User ${req.user.id} not authorized to update ${req.params.id} bootcamp`, 401));
        }

        bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
            runValidators:true
        })

        res.status(201).json({
            success:true,
            data:bootcamp
        })
});

//@desc     deletes a bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next)=>{
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp){
            return next(new ErrorResponse(`Resource not found id of ${req.params.id}`, 404));
        }
        //Make sure user is bootcamp owner
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return next(new ErrorResponse(`User ${req.user.id} not authorized to delete ${req.params.id} bootcamp`, 401));
        }
        bootcamp.remove();
        res.status(200).json({
            success:true,
            data: {}
        })
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

//@desc     upload photo for bootcamp
//@route    PUT /api/v1/bootcamps/:id/photo
//@access   Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next)=>{
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp){
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404)
        );
    }

    if (!req.files){
        return next(
            new ErrorResponse(`Please upload a file`,404)
        );
    }
    const file = req.files.file;

    //make sure file is photo
    if (!file.mimetype.startsWith('image')){
        return next(
            new ErrorResponse(`File type must be an image`,400)
        );
    }

    //check file size
    if (file.size> process.env.MAX_FILE_UPLOAD){
        return next(
            new ErrorResponse(`File size must be within ${process.env.MAX_FILE_UPLOAD} KB `,400)
        );
    }

    //create custom file name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err =>{
        if (err){
            console.log(err);
            return next(
                new ErrorResponse(`Problem with file upload`,500)
            );
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, {photo:file.name});
        res.status(201).json({
            success:true,
            data:file.name
        })
    })
});