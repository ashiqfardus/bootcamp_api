const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema({
   name:{
       type:String,
       required:[true, 'Please add a name'],
       unique:true,
       trim:true,
       maxLength:[50, 'Name can\'t be more than 50 character']
   },
    slug:String,
    description:{
        type:String,
        required:[true, 'Please add a description'],
        maxLength:[500, 'Name can\'t be more than 500 character']
    },
    website:{
       type:String,
        match:[/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,'Please use a valid URL with HTTP or HTTPS']
    },
    phone:{
       type:String,
        maxLength:[20,'Phone number can\'t be more than 20 digits']
    },
    email:{
       type:String,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please add a valid email.']
    },
    address:{
       type:String,
        required:[true, 'Please add an address']
    },
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: false
        },
        coordinates: {
            type: [Number],
            required: false,
            index:'2dsphere'
        },
        formattedAddress:String,
        street:String,
        city:String,
        state:String,
        zipcode:String,
        country:String,
    },

    careers:{
       type:[String],
        required:true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Others'
        ]
    },
    averageRating:{
       type:String,
        min: [1, 'Rating must be atleast 1'],
        max: [10, 'Rating can\'t be more than 10']
    },
    averageCost:Number,
    Photo:{
       type:String,
        default:'no-photo.jpg'
    },
    housing:{
       type:Boolean,
        default: false
    },
    jobAssistance:{
       type:Boolean,
        default: false
    },
    jobGuarantee:{
       type:Boolean,
        default: false
    },
    acceptGi:{
       type:Boolean,
        default: false
    },
    createdAt:{
       type:Date,
        default:Date.now
    }
},
    {
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
    });

//create bootcamp slug from the name
BootcampSchema.pre('save', function (next){
   this.slug = slugify(this.name, {
       lower:true,
       trim:true,
   });
   next();
});


// geocode & create location field

BootcampSchema.pre('save', async function (next){
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type:'Point',
        coordinates:[loc[0].longitude, loc[0].latitude],
        formattedAddress:loc[0].formattedAddress,
        street:loc[0].street,
        city:loc[0].city,
        state:loc[0].state,
        zipcode:loc[0].zipcode,
        country:loc[0].country,
    };

    //do not save address
    this.address = undefined;
   next();
});

//cascade delete courses when bootcamp is deleted
BootcampSchema.pre('remove', async function (next){
    console.log(`Courses been removed for bootcamp ${this.id}`);
    await this.model('Course').deleteMany({bootcamp:this._id});
    next();
});

//Reverse populate with virtual
BootcampSchema.virtual('courses',{
    ref:'Course',
    localField:'_id',
    foreignField:'bootcamp',
    justOne:false
})

module.exports = mongoose.model('Bootcamp',BootcampSchema);