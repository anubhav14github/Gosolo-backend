const mongoose = require('mongoose');
require('../config/config');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

// Create a storage object with a given configuration
const storage = new GridFsStorage({
    url: process.env.MONGO_URL, options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    file:  (req,file) => {
       if (file.mimetype === 'image/jpeg' || 'image/png') {
        return data = new Promise((resolve, reject) => {
          const fileInfo = {
            filename : Date.now()+file.originalname ,
            bucketName: 'uploads',
          };
          resolve(fileInfo);
        });
       }
    }
  });
  
  const upload = multer({ storage });
  module.exports = upload;