const mongoose = require('mongoose');
const Profile = require('../models/profile.model')
const bd = require('../models/biodata.model');

module.exports.profile = async (req, res) => {
    try {
        let data = new Profile({
            fullname: req.body.fullname,
            gender: req.body.gender,
            DOB: req.body.DOB,
            phone: req.body.phone,
            Aboutme: req.body.Aboutme,
            qualification: req.body.qualification,
            job: req.body.job,
            company: req.body.company,
            worksample: req.body.worksample,
            user: req.userId,
            image: req.body.image
        });
        const result = await data.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(`Error when trying upload image: ${error}`);
    }
};

module.exports.qualifications = async (req, res) => {
    try {
        let data = new bd.qualification(
            {
            types: req.body.types,
            marks: req.body.marks,
            Institute: req.body.Institute,
            year: req.body.year,
            user: req.userId
        }
        );

        const result = await data.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(`Error when trying upload image: ${error}`);
    }
};

module.exports.job = async (req, res) => {
    try {
        let data = new bd.job({
            company: req.body.company,
            duration: req.body.duration,
            position: req.body.position,
            user: req.userId
        });

        const result = await data.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(`Error when trying : ${error}`);
    }
};

module.exports.work = async (req, res) => {
    try {
        let data = new bd.worksample({
            name: req.body.name,
            link: req.body.link,
            user: req.userId
        });

        const result = await data.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send(`Error when trying upload image: ${error}`);
    }
};

module.exports.getprofile = async (req, res) => {
    try {
        const pro = await Profile.findById({ _id: req.params.id })
           .populate("qualification job worksample user");
        res.status(200).json(pro);

    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}

module.exports.getquali = async (req, res) => {
    try {
        const data = await bd.qualification.find({ _id: { $in: req.body.id } })
        res.status(200).json(data);

    } catch (error) {
        res.status(400).send(error);
    }
}
module.exports.getjob = async (req, res) => {
    try {
        const data = await bd.job.find({ _id: { $in: req.body.id } })
        res.status(200).json(data);

    } catch (error) {
        res.status(400).send(error);
    }
}
module.exports.getwork = async (req, res) => {
    try {
        const data = await bd.worksample.find({ _id: { $in: req.body.id } })
        res.status(200).json(data);

    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports.updateQualification = async (req, res) => {
    try {
        const types = req.body.types;
        const marks = req.body.marks;
        const Institute = req.body.Institute;
        const year = req.body.year;

        const data = await bd.qualification.findByIdAndUpdate({ _id: req.params.id },
            {
                $set: {
                    types: types,
                    marks: marks,
                    Institute: Institute,
                    year: year
                }
            }, { new: true });
        if (data) {
            res.status(200).json({ data })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}

module.exports.updateJob = async (req, res) => {
    try {
        const company = req.body.company;
        const duration = req.body.duration;
        const position = req.body.position;

        const data = await bd.job.findByIdAndUpdate({ _id: req.params.id },
            {
                $set: {
                    company: company,
                    duration: duration,
                    position: position,
                }
            }, { new: true });
        if (data) {
            res.status(200).json({ data })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}

module.exports.updateWorksample = async (req, res) => {
    try {
        const name = req.body.name;
        const link = req.body.link;

        const data = await bd.worksample.findByIdAndUpdate({ _id: req.params.id },
            {
                $set: {
                    name: name,
                    link: link
                }
            }, { new: true });
        if (data) {
            res.status(200).json({ data })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}

module.exports.updateProfile = async (req, res) => {
    try {
        const fullname = req.body.fullname;
        const age = req.body.age;
        const phone = req.body.phone;
        const Aboutme = req.body.Aboutme;
        const company = req.body.company;

        const data = await Profile.findByIdAndUpdate({ _id: req.params.id },
            {
                $set: {
                    fullname: fullname,
                    age: age,
                    phone: phone,
                    Aboutme: Aboutme,
                    company:company,
                }
            }, { new: true });
        if (data) {
            res.status(200).json({ data })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}


