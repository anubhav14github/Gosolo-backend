const User = require('../models/user.model');
const Role = require('../models/role.model');
const ROLES = ['provider', 'freelancer', 'blogger'];

module.exports.CheckRoles = async (req, res, next) => {
  try {
    const roles = req.body.role;
    if(roles === undefined){
      res.status(400).send({ message: `roles are required` });
      next();
      return;
    }

  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
  next();
}

module.exports.CheckUserOrEmail = async (req, res, next) => {
  try {
  
    const Email = await User.findOne({ email: req.body.email });

   if (Email) {
      res.status(400).send({ message: `failed! email ${req.body.email} already exists:` });
      return;
    } else {
      next();
      return;
    }

  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
  next();
}

