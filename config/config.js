var env = process.env.NODE_ENV || "development";
const config = require('./config.json');

var envConfig = config[env];
Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);
// mongodb+srv://deepak2803:deepak2803@gosolo.pfp4te6.mongodb.net/?retryWrites=true&w=majority