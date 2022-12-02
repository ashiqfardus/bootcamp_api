const ErrorResponse =require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

//@desc     Register user
//@route    GET /api/v1/auth/register
//@access   Public

exports.register = asyncHandler(async (req, res, next)=>{
    const {name, email, password, role} = req.body;

    //create user
    const user = await User.create({
        name, email, password, role
    });

    //create token
    const token = user.getSignedJwtToken();

    res.status(201).json({
        success:true,
        token:token
    })
});