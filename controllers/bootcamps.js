const Bootcamp = require('../models/Bootcamp');


//@desc     Get all bootcamp
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = async (req, res, next)=>{
    try{
        const bootcamp = await Bootcamp.find();
        res.status(200).json({
            success:true,
            count:bootcamp.length,
            data: bootcamp
        });
    }
    catch (e){
        res.status(404).json({
            success:false,
            msg:e.message
        })
    }

}

//@desc     Get single bootcamp
//@route    GET /api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp = async (req, res, next)=>{
    try{
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (bootcamp){
            res.status(200).json({
                success:true,
                data: bootcamp
            });
        }
        else {
            res.status(404).json({
                success:false,
                msg:'No data found.'
            })
        }

    }
    catch (e){
        res.status(404).json({
            success:false,
            msg:e.message
        })
    }
}

//@desc     Create a bootcamp
//@route    POST /api/v1/bootcamps
//@access   Private
exports.createBootcamp = async (req, res, next)=>{
   try{
       const bootcamp = await Bootcamp.create(req.body);
       res.status(201).json({
           success:true,
           data:bootcamp
       })
   }
   catch (e){
       res.status(400).json({
           success:false,
           msg:e.message
       })
   }
}

//@desc     updates a bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   Private
exports.updateBootcamp = async (req, res, next)=>{
    try{
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
            res.status(400).json({
                success:false
            })
        }
    }
    catch (e){
        res.status(400).json({
            success:false,
            msg:e.message
        })
    }

}

//@desc     deletes a bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootcamp = async (req, res, next)=>{
    try{
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if (bootcamp){
            res.status(201).json({
                success:true,
                data:bootcamp
            })
        }
        else{
            res.status(400).json({
                success:false,
                msg:'No data found.'
            })
        }
    }
    catch (e){
        res.status(400).json({
            success:false,
            msg:e.message
        })
    }
}