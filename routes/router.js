//declarations
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/imageupload')


//imports
const ctrlUser = require('../controllers/user.controller');
const ctrlRole = require('../controllers/role.controller');
const ctrlUpload = require('../controllers/upload.controller');
const ctrlProfile = require('../controllers/profile.controllers')
const ctrlActivity = require('../controllers/activity.controller');
const ctrlBlogs = require('../controllers/blogs.controller');
const chatRoom = require('../controllers/chatroom.controller');
const mdlreg = require('../middlewares/verifyregister')
const auth = require('../middlewares/AuthJwt')

// /api/user registration
router.post('/addrole', ctrlRole.addrole);
router.post('/auth/register', [mdlreg.CheckRoles, mdlreg.CheckUserOrEmail], ctrlUser.register);
router.get("/auth/",ctrlUser.getemail);
router.post('/auth/login', ctrlUser.login);
router.post("/auth/refreshtoken", ctrlUser.refreshToken);
router.put("/auth/UpdateUserById", [auth.verifyToken] , ctrlUser.updatereg)
router.patch("/auth/forgotpassword" , ctrlUser.forgotpass);
router.patch("/auth/addprofileID",[auth.verifyToken] , ctrlUser.addprofileID)
router.delete("/auth/RemoveUser" , [auth.verifyToken], ctrlUser.RemoveUser);

//api/ image uploads 
router.post("/auth/upload", [auth.verifyToken], upload.single('file') , ctrlUpload.uploadFile );
router.get("/auth/getImage/:name",ctrlUpload.getImagesById);
router.get("/auth/image/:filename",ctrlUpload.getimagebyID);
router.delete("/auth/deleteImage/:id",[auth.verifyToken] ,ctrlUpload.DeleteImage);

//api profile 
router.post("/auth/addqualifications",[auth.verifyToken], ctrlProfile.qualifications);
router.post("/auth/addjob",[auth.verifyToken], ctrlProfile.job);
router.post("/auth/addworksample",[auth.verifyToken], ctrlProfile.work);
router.post("/auth/addprofile",[auth.verifyToken], ctrlProfile.profile);
router.get("/auth/getprofile/:id",[auth.verifyToken], ctrlProfile.getprofile);
router.post("/auth/getqualification",[auth.verifyToken], ctrlProfile.getquali);
router.post("/auth/getjob",[auth.verifyToken], ctrlProfile.getjob);
router.post("/auth/getwork",[auth.verifyToken], ctrlProfile.getwork);
router.put("/auth/updateQualification/:id",[auth.verifyToken], ctrlProfile.updateQualification);
router.put("/auth/updateJob/:id",[auth.verifyToken], ctrlProfile.updateJob);
router.put("/auth/updateWorksample/:id",[auth.verifyToken], ctrlProfile.updateWorksample);
router.put("/auth/updateProfile/:id",[auth.verifyToken], ctrlProfile.updateProfile);

//api Activity
router.post("/auth/AddPost",[auth.verifyToken], ctrlActivity.posts);
router.get("/auth/getposts",[auth.verifyToken], ctrlActivity.getposts);
router.get("/auth/getposts/:category",[auth.verifyToken], ctrlActivity.getpostsbycategory);
router.get("/auth/getpostBy/:id",[auth.verifyToken], ctrlActivity.getpostById);
router.get("/auth/postbyproviderID/:id",[auth.verifyToken], ctrlActivity.getpostbyproviderId);
router.get("/auth/postbyselectedID/:id",[auth.verifyToken], ctrlActivity.postbyselectedID);
router.patch("/auth/Addbidder/:id",[auth.verifyToken], ctrlActivity.addbidder);
router.patch("/auth/Selectbidder/:id",[auth.verifyToken], ctrlActivity.SelectBidder);
router.put("/auth/UpdatePost/:id",[auth.verifyToken], ctrlActivity.Updatepost);
router.patch("/auth/updatefile/:id",[auth.verifyToken], ctrlActivity.updatefile);
router.patch("/auth/updateWS/:id",[auth.verifyToken], ctrlActivity.updateWS);
router.patch("/auth/Reviewwork/:id",[auth.verifyToken], ctrlActivity.review);
router.patch("/auth/resubmit/:id", ctrlActivity.resubmit);
router.patch("/auth/confirm/:id", ctrlActivity.confirm);
router.patch("/auth/updatePay/:id", ctrlActivity.updatepaystatus);
router.patch("/auth/Removebidder/:id",[auth.verifyToken], ctrlActivity.removebidder);
router.delete("/auth/deletePostBy/:id",[auth.verifyToken], ctrlActivity.DeletePost);
router.post('/auth/orders',[auth.verifyToken], ctrlActivity.order)
router.post('/auth/payout',[auth.verifyToken], ctrlActivity.payout)
router.post('/auth/verify',[auth.verifyToken], ctrlActivity.verify)
router.get("/auth/getpaymentbypost/:id",[auth.verifyToken], ctrlActivity.getpaymentbypostID);

//api Blog
router.post("/auth/Createblog", [auth.verifyToken], ctrlBlogs.Createblog);
router.post("/auth/addComment" , [auth.verifyToken], ctrlBlogs.addcomment);
router.get("/auth/getblogs", ctrlBlogs.getblogs);
router.get("/auth/getblogBy/:id", [auth.verifyToken], ctrlBlogs.getblogById);
router.get("/auth/getblogbyUserID/:id", [auth.verifyToken], ctrlBlogs.getblogsbyuserID);
router.get("/auth/getcommentsbyBlogID/:id", [auth.verifyToken], ctrlBlogs.getcommentsbyBlogID);
router.put("/auth/updateBlog/:id", [auth.verifyToken],ctrlBlogs.Updateblog);
router.delete("/auth/deleteBlogBy/:id", [auth.verifyToken], ctrlBlogs.DeleteBlog);

//api Chat 
router.post('/auth/initiate',[auth.verifyToken], chatRoom.initiate)
router.post('/auth/:roomId/message',[auth.verifyToken], chatRoom.postMessage)
router.put('/auth/:roomId/mark-read',[auth.verifyToken], chatRoom.markConversationReadByRoomId);
router.get('/auth/:roomId',[auth.verifyToken], chatRoom.getConversationByRoomId)
router.delete("/auth/deleteBy/:roomId",[auth.verifyToken], chatRoom.deleteRoomById);
router.delete("/auth/deleteMessagesBy/:messageId",[auth.verifyToken], chatRoom.deleteMessageById);

//api Payement 


module.exports = router;