const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const qualificationSchema = new Schema({
    types: {
        type: String
    },
    marks: {
        type: Number
    },
    Institute: {
        type: String
    },
    year: {
        type: String
    },
    user: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const jobSchema = new Schema({
    company: {
        type: String
    },
    duration: {
        type: String
    },
    position: {
        type: String
    },
    user: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const worksampleSchema = new Schema({
    name: {
        type: String
    },
    link: {
        type: String,
        maxlength: 80
    },
    user: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const qualification = mongoose.model('qualification', qualificationSchema);
const job = mongoose.model('job', jobSchema);
const worksample = mongoose.model('worksample', worksampleSchema);

module.exports = { qualification, job, worksample };