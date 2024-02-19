const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const User = require('../models/user.model');
const Role = require('../models/role.model');
const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.sendStatus(401).send({ message: "Unauthorized!" });
}

verifyToken = async (req, res, next) => {
    try {
        let token = req.headers['x-access-token'];

        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }

        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return catchError(err, res);
            }
            req.userId = decoded.id;
            next();
        });
    } catch (err) {        
        res.status(400).send(err);
        console.log(err);
        next();
        return;
    }
};

isProvider = async (req, res, next) => {
    try {
        const provider = await User.findOne({ username:req.body.username }).populate("role");

        for (let i = 0; i < provider.role.length; i++) {
            if (provider.role[i].name === "provider") {
                next();
                return;
            }
        }
        return res.status(403).send({ message: "You Can't access this resource!" });

    } catch (error) {
        res.status(400).send(error)
    }
    next();
}

isFreelancer = async (req, res, next) => {
    try {
        const freelancer = await User.findOne({ username:req.body.username }).populate("role");
    
        for (let i = 0; i < freelancer.role.length; i++) {
            if (freelancer.role[i].name === "freelancer") {
                next();
                return;
            }
        }
        return res.status(403).send({ message: "You Can't access this resource!" });
        

    } catch (error) {
        res.status(400).send(error);
    }
next();
}

isBlogger = async (req, res, next) => {
    try {
        const blogger = await User.findOne({ username:req.body.username }).populate("role");
    
        for (let i = 0; i <blogger.role.length; i++) {
            if (blogger.role[i].name === "blogger") {
                next();
                return;
            }
        }
        return res.status(403).send({ message: "You Can't access this resource!" });

    } catch (error) {
        res.status(400).send(error);
        console.log(error);

    }
next();
}

const authJwt = {
    verifyToken,
    isProvider,
    isFreelancer,
    isBlogger
};
module.exports = authJwt;