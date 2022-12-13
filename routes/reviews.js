const express = require('express');
const {getReviews} = require('../controllers/reviews');

const advancedResults = require('../middleware/advancedResults');
const router = express.Router({mergeParams:true});
const {protect,authorize} = require('../middleware/auth');
const Review = require('../models/Review');
const {model} = require("mongoose");

router
    .route('/')
    .get(
        advancedResults(Review,{
        path:'',
        select:''
        }), getReviews);

module.exports = router;