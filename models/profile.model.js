const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bd = require('../models/biodata.model');

const ProfileSchema = new Schema({
    fullname: {
        required: true,
        type: String,
    },
    gender: {
        type: String
    },
    DOB: {
        type: Date
    },
    phone: {
        type: String,
        validate(value) {
            if (!validator.isMobilePhone(value)) {
                throw new Error("Phone number is invalid");
            }
        }
    },
    Aboutme: {
        type: String,
    },
    qualification: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: bd.qualification
    }],
    job: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: bd.job 
    }],
    company: {
        type: String
    },
    worksample: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: bd.worksample      
    }],
    user: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    image: {
        type:String
    },
});

const Profile = mongoose.model('Profile', ProfileSchema);
module.exports = Profile;