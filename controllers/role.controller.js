//require
require('../routes/router');
require('../models/role.model');
require('../models/db');

//import
const mongoose = require('mongoose');
const Role = require('../models/role.model')

module.exports.addrole = async (req, res) => {
    try {
        let data = new Role({
            name: req.body.name
        })

        const role = await data.save();
        if (role) {
            res.status(201).json(role);
        }
    }
    catch (error) {
        res.status(400).send(error);
    }

}
