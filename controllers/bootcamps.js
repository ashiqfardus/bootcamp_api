const ErrorResponse =require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');


//@desc     Get all bootcamp
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = asyncHandler(async (req, res, next)=>{
    // let query;
    //copy req.query
    const reqQuery={...req.query};

    //fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //loop over remove fields and delete them from reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);

    //create query string
    let queryStr = JSON.stringify(reqQuery);

    //create operators ($gt, $gte, $lte, $lt)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);

    //finding resources
    let query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    //SELECT fields
    if (req.query.select){
        const  fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //sort
    if (req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }
    else{
        query = query.sort('-createdAt');
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 3;
    const startIndex = (page-1)*limit;
    const endIndex = (page)*limit;
    const total = await Bootcamp.countDocuments();
    // console.log(total);

    query = query.skip(startIndex).limit(limit);

    //executing query
    const bootcamp = await query;

    //pagination result
    const pagination = {};
    if (endIndex<total){
        pagination.next = {
            page:page+1,
            limit
        }
    }
    if (startIndex>0){
        pagination.prev = {
            page:page-1,
            limit
        }
    }

    res.status(200).json({
        success:true,
        count:bootcamp.length,
        pagination:pagination,
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
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (bootcamp){
            bootcamp.remove();
            res.status(200).json({
                success:true,
                data: {}
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