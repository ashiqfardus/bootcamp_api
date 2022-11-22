//@desc     Get all bootcamp
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = (req, res, next)=>{
    res.status(200).json({
        success:true,
        msg:'Show bootcamps'
    });
}

//@desc     Get single bootcamp
//@route    GET /api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp = (req, res, next)=>{
    res.status(200).json({
        success:true,
        msg:`Show single bootcamp ${req.params.id}`
    });
}

//@desc     Create a bootcamp
//@route    POST /api/v1/bootcamps
//@access   Private
exports.createBootcamp = (req, res, next)=>{
    res.status(200).json({
        success:true,
        msg:'Create new bootcamp'
    });
}

//@desc     updates a bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   Private
exports.updateBootcamp = (req, res, next)=>{
    res.status(200).json({
        success:true,
        msg:`update bootcamp ${req.params.id}`
    });
}

//@desc     deletes a bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootcamp = (req, res, next)=>{
    res.status(200).json({
        success:true,
        msg:`delete bootcamp ${req.params.id}`
    });
}