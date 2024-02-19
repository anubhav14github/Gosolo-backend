const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        lowercase:true,
        unique:true
    }
});

const Role = mongoose.model('Role', RoleSchema,'Role');
module.exports = Role;