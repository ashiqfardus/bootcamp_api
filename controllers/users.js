const ErrorResponse =require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

//@desc     Get all users
//@route    GET /api/v1/auth/users
//@access   private/Admin

exports.getUsers = asyncHandler(async (req, res, next)=>{
    res.status(200).json(res.advancedResults);
});

//@desc     Get single user
//@route    GET /api/v1/auth/user/:id
//@access   private/Admin

exports.getUser = asyncHandler(async (req, res, next)=>{
    const user = await User.findById(req.params.id);

    if (!user){
        return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
    }
    res.status(200).json({
        success:true,
        data:user
    })
});

//@desc     Create new user
//@route    POST /api/v1/auth/users
//@access   private/Admin

exports.createUser = asyncHandler(async (req, res, next)=>{
    const user = await User.create(req.body);
    res.status(200).json({
        success:true,
        data:user
    })
});

//@desc     Update a user
//@route    PUT /api/v1/auth/user/:id
//@access   private/Admin

exports.updateUser = asyncHandler(async (req, res, next)=>{
    let user = await User.findById(req.params.id);
    if (!user){
        return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
    }
    await User.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true
    });
    user = await User.findById(req.params.id);
    res.status(200).json({
        success:true,
        data:user
    })
});


//@desc     Delete a user
//@route    DELETE /api/v1/auth/user/:id
//@access   private/Admin

exports.deleteUser = asyncHandler(async (req, res, next)=>{
    const user = await User.findById(req.params.id);
    if (!user){
        return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
    }
    User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success:true,
        data:{}
    })
});