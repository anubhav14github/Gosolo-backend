//require
require('../routes/router')

//import
const bcrypt = require('bcryptjs');
const validator = require('validator');
const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
// var cookieParser = require('cookie-parser')
const User = require('../models/user.model');
const Role = require('../models/role.model');
const RefreshToken = require('../models/refreshToken.model');

module.exports.register = async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.cnfpass;

        if (password === cpassword) {
            let data = new User({
                email: req.body.email,
                password: password,
                cnfpass: cpassword,
                role: req.body.role,

            })

            if (req.body.role) {
                const eg = await Role.find({ name: req.body.role });
                data.role = eg.map(role => role._id);
                const reg = await data.save();
                res.status(201).json(reg);
                
            }
        }
        else {
            res.status(400).send("passwords not matching");
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error)       
        
    }
}
module.exports.getemail = async (req, res) => {
    try {
       res.status(200).send("Welcome to home page")
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}

module.exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email: email }).populate("role");
        if (user === null || undefined) {
            return res.status(400).send("Wrong user")
        }
        const isSame = await validator.equals(email, user.email);
        const isMatch = await bcrypt.compare(password, user.password);


        if (isMatch && isSame) {
            var authorities = [];
            for (let i = 0; i < user.role.length; i++) {
                authorities.push(user.role[i].name.toUpperCase());
            }


            var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: config.jwtExpiration
            });
            var refreshToken = await RefreshToken.createToken(user);

            let data = ({
                id: user._id,
                email: user.email,
                role: authorities,
                accessToken: token,
                RefreshToken: refreshToken,
                profileID: user.profileID,
                fullname: user.fullname,
                image: user.image                
            })

            res.status(200).json(data);
            console.log(data)
        } else {
            res.status(400).send("please enter valid user details and try again");
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);

    }
}

module.exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;

    if (requestToken == null) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }

    try {
        let refreshToken = await RefreshToken.findOne({ token: requestToken });

        if (!refreshToken) {
            res.status(403).json({ message: "Refresh token is not in database!" });
            return;
        }

        if (RefreshToken.verifyExpiration(refreshToken)) {
            const del = await RefreshToken.findByIdAndRemove(refreshToken._id);

            res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
            return;
        }

        let newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.secret, {
            expiresIn: config.jwtExpiration,
        });

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

module.exports.updatereg = async (req, res) => {
    try {

        const password = req.body.password;
        const cpassword = req.body.cnfpass;
        const email = req.body.email;
        const role = [req.body.role];
        const empty = validator.isEmpty(password && cpassword);

        if (password === cpassword && !empty) {
            if (role) {
                const eg = await Role.find({ name: { $in: req.body.role } });
                const roles = eg.map(role => role._id);
                const hashpass = await bcrypt.hash(password, 10);

                const user = await User.findByIdAndUpdate({ _id: req.userId }, {
                    $set: {
                        username: username,
                        email: email,
                        password: hashpass,
                        role: roles
                    }
                }, { new: true });
                res.status(200).json({
                    success: true,
                    user
                });
            }
        } else {
            res.status(400).send("passwords not matching");
        }
    } catch (error) {
        return res.status(400).json({ error });

    }
}

module.exports.addprofileID = async (req, res) => {
    try {

        const profileID = req.body.profileID;

        const user = await User.findByIdAndUpdate({ _id: req.userId }, {
            $set: {
                profileID: profileID,
                fullname: req.body.fullname,
                image: req.body.image
            }
        }, { new: true })

        res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ error });

    }
}

module.exports.forgotpass = async (req, res) => {
    try {
        const query = req.query;
        const password = req.body.password;
        const cpassword = req.body.cnfpass;
        const empty = validator.isEmpty(password && cpassword);
        const hashpass = await bcrypt.hash(password, 10);

        if (password === cpassword && !empty) {
            const user = await User.findOneAndUpdate(query, {
                $set: {
                    password: hashpass
                }
            }, { new: true });

            if (user == null || undefined) {
                res.status(400).send("User doesn't exists!!!")
            }
            res.status(200).json(user);

        } else {
            res.status(400).send("passwords not matching")
        }
    } catch (error) {
        return res.status(500).json({ error });

    }
}

module.exports.RemoveUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete(req.userId);
        res.status(200).json({
            success: true,
            deletedId: user._id,
            user
        });

    } catch (error) {
        return res.status(400).json({ error });

    }
}
