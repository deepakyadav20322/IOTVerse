const express= require("express");
const user_Route = express();
const userControler = require("../controlers/userControler");
const bodyParser = require("body-parser");
const path = require("path");
const userAuth = require("../middleware/userMiddleware");
const { insertUserValidation } = require('../public/javascript/expressValidater'); 

const multer = require("multer");



//session middleware-------------
const session = require("express-session");
user_Route.use(session({
    secret:process.env.SECERET,
     resave: false,
     saveUninitialized: true,
   }));

 // to set the cookie parser with middleware..........  
const cookieParser = require("cookie-parser");
   user_Route.use(cookieParser());



// -------------upload files by using multer package-----------
const storage = multer.diskStorage({
    destination:function(req,file,cb){
       cb(null,path.join(__dirname ,'../public/userProfileImage') );
                   
    },
    filename:function(req,file,cb){
        const name = Date.now() + '-'+ file.originalname; 
        cb(null,name);
    }
});

const fileFilter = (req,file,cb)=>{
   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
         cb(null,true) ;
   }
   else{
    cb(null,false) ;
   }

} 
const upload = multer({
   storage: storage,
   limits: { fileSize: 1024*300 },
   fileFilter:fileFilter
    });




// middeleware for static files uses
user_Route.use(express.static('public'));

//set the view engine
user_Route.set('view engine','ejs');
user_Route.set('views','./views/user');

//To encode the comming form data
user_Route.use(bodyParser.json());
user_Route.use(bodyParser.urlencoded({extended:true}));




user_Route.get('/login',userAuth.isLogout,userControler.loadLogin);
user_Route.get('/resister',userAuth.isLogout,userControler.resisterLoad);
user_Route.get('/userDashboard',userAuth.isLogin,userControler.userDashboard);
user_Route.post('/resister',upload.single('image'),insertUserValidation,userControler.insertUser);
user_Route.get('/mailVerifypage',userControler.userMailVerifyLoad);
user_Route.post('/login',userControler.loginVerification);
user_Route.get('/sendForgetPassMail',userAuth.isLogout,userControler.sendForgetPassMail);
user_Route.post('/sendForgetPassMail',userControler.forgetPassVarify);
user_Route.get('/forgetPassword',userAuth.isLogout,userControler.forgetPasswordLoad);
user_Route.post('/forgetPassword',userControler.forgetPassword);
user_Route.get('/emailVerify',userAuth.isLogout,userControler.directEmailVerifyLoad);
user_Route.post('/emailVerify',userControler.directEmailVerify);
// user_Route.get('/updateProfile',userControler.updateProfileLoad);
user_Route.post('/updateProfile',upload.single('image'),userControler.updateProfile);
user_Route.get("/logout",userAuth.isLogin,userControler.logout);

user_Route.post('/subscribeUsers',userControler.subscribeUsers);

user_Route.use(function (err, req, res, next) {
  
   if (err.code === 'LIMIT_FILE_SIZE') {
     
      if(req.path == '/resister'){
       res.render('resister',{message:"File size must be less than 300kb."})
      }
      
      else if(req.path == '/updateProfile'){
         const notifier = require('node-notifier');
            notifier.notify({
            title: 'Alert message',
            message: 'User profile image size must be less than 300kb.',
            time: 5000,
            type: 'warn' 
            });
        res.redirect('/userDashboard')
      }
      else{
         res.send("Something went wrong on server!");
         console.log("Something went wrong when you upload file (This error can be due to file size ,which is handle by a middleware in this admin_Route page .....)")
      }
     return 
   } 
 })



module.exports = user_Route;
