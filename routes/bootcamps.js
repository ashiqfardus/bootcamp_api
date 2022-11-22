const express = require('express');
const router = express.Router();


//get all bootcamps
router.get('/', (req, res)=>{
    res.status(200).json({
        success:true,
        msg:'Show bootcamps'
    })
})

//get single bootcamp
router.get('/:id', (req, res)=>{
    res.status(200).json({
        success:true,
        msg:`Show single bootcamp ${req.params.id}`
    })
})

//create new bootcamp
router.post('/', (req, res)=>{
    res.status(200).json({
        success:true,
        msg:'Create new bootcamp'
    })
})

//update a bootcamp
router.put('/:id', (req, res)=>{
    res.status(200).json({
        success:true,
        msg:`update bootcamp ${req.params.id}`
    })
})

//delete one bootcamp
router.delete('/:id', (req, res)=>{
    res.status(200).json({
        success:true,
        msg:`delete bootcamp ${req.params.id}`
    })
});

module.exports = router;