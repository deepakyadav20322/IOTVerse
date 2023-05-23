const express= require("express");
const admin_Route = express();
const bodyParser = require("body-parser");
const adminAuth = require('../middleware/adminAuth');
const path=require("path");
const multer = require("multer");
const adminControler = require('../controlers/adminControler');
const { addEventValidation } = require('../public/javascript/expressValidater'); 
const { insertUserValidation } = require('../public/javascript/expressValidater'); 
const { addGalleryValidation } = require('../public/javascript/expressValidater'); 


const session = require('express-session');
const { dirname } = require("path");
   admin_Route.use(session({secret:process.env.SECERET,
    resave: false,
    saveUninitialized: true,
}));


 
 // -------------upload files by using multer package for add new user -----------
 const storage = multer.diskStorage({
    destination:function(req,file,cb){
       cb(null,path.join(__dirname ,'../public/userProfileImage') );
                   
    },
    filename:function(req,file,cb){
        const name = Date.now() + '-'+ file.originalname; 
        cb(null,name);
    }
 });

 const fileFilter1 = (req,file,cb)=>{
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
   fileFilter:fileFilter1,
    });





   // -------------upload files by using multer package for event section  -----------
const event_storage = multer.diskStorage({
   destination:function(req,file,cb){
      cb(null,path.join(__dirname ,'../public/event-images') );
                  
   },
   filename:function(req,file,cb){
       const name = Date.now() + '-'+ file.originalname; 
       cb(null,name);
   }
});

const fileFilter2 = (req,file,cb)=>{
   if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
         cb(null,true) ;
   }
   else{
    cb(null,false) ;
   }

}

const event_upload = multer({
  storage: event_storage,
  limits: {
   fileSize: 1*1024*1024
},
  fileFilter:fileFilter2 ,
   });


 // -------------Upload Single files by using multer package for e Gallery Images ---------------------

 const gallery_storage = multer.diskStorage({
   destination:function(req,file,cb){
      cb(null,path.join(__dirname ,'../public/galleryImages') );
                  
   },
   filename:function(req,file,cb){
       const name = Date.now() + '-'+ file.originalname; 
       cb(null,name);
   }
});


const fileFilter3 = (req, file, cb) => {
   console.log('IN MULTER')

   if ((file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg")) {
      cb(null, true);
   } else {
     cb(null, false);
   }
 };
 
const gallery_upload = multer({
  storage: gallery_storage, 
  limits: {
      fileSize: 1*1024*1024
},
  fileFilter:fileFilter3 ,
   });


// middleware for static files............ 
admin_Route.use(express.static('public'));


//set the view engine 
admin_Route.set('view engine','ejs') 
admin_Route.set('views','./views/admin');

//To encode the comming form data
admin_Route.use(bodyParser.json());
admin_Route.use(bodyParser.urlencoded({extended:true}));



admin_Route.get('/adminLogin',adminAuth.islogout,adminControler.adminLoginLoad);
admin_Route.post('/adminLogin',adminControler.adminLogin);
admin_Route.get('/adminDashboard',adminAuth.islogin,adminControler.adminDashboardLoad);
admin_Route.get('/adminlogout',adminAuth.islogin,adminControler.logout);
admin_Route.get('/edit-user', adminAuth.islogin,adminControler.editUserLoad);
admin_Route.post('/edit-user',adminControler.editUser);
admin_Route.get('/delete-user',adminAuth.islogin,adminControler.deleteUser);

admin_Route.get('/new-user',adminAuth.islogin,adminControler.newUserLoad);
admin_Route.post('/new-user',upload.single('image'),insertUserValidation,adminControler.newUserAdd);
admin_Route.get('/logout',adminAuth.islogin,adminControler.logout);

admin_Route.get('/adminEventPage',adminAuth.islogin,adminControler.adminEventPageLoad);
admin_Route.get('/updateEvent',adminAuth.islogin,adminControler.updateEventLoad);
admin_Route.post('/updateEvent',event_upload.single('eventImage'),addEventValidation,adminControler.updateEvent);
admin_Route.get('/addEvent',adminAuth.islogin,adminControler.addEventLoad);
admin_Route.post('/addEvent',event_upload.single('eventImage'),addEventValidation,adminControler.addEvent);
admin_Route.get('/deleteEvent',adminAuth.islogin,adminControler.deleteEvent);
admin_Route.get('/export-excel',adminAuth.islogin,adminControler.exportUesrExcel)
admin_Route.get('/uploadGalleryImg',adminAuth.islogin,adminControler.uploadGalleryImgLoad);
admin_Route.post('/uploadGalleryImg',gallery_upload.single("gallery"),addGalleryValidation,adminControler.uploadGalleryImg);



//====   Middleware for give error when file size limit greater(if you give limits in multer function object)   =======
//   ??---(if you are not give size then do not need give condition in this middleware)---??


admin_Route.use(function (err, req, res, next) {
  
   if (err.code === 'LIMIT_FILE_SIZE') {
      if(req.path == '/uploadGalleryImg'){
       res.render('addGalleryImage',{message:"File size must be less than 1Mb."})
      }
      else if(req.path == '/addEvent'){
         res.render('addEvent',{message:"File size must be less than 1Mb."})
      }
      else if(req.path == '/new-user'){
         res.render('newUser',{message:"File size must be less than 300kb."})
      }
      else if(req.path == '/updateEvent'){
        
         const notifier = require('node-notifier');
         notifier.notify({
         title: 'Alert message',
         message: 'When you Upload Event Image then file size must be less than 1Mb. Please update event again',
         time: 5000,
         type: 'warn' 
         });
        
     res.redirect(`/admin/adminEventPage`);
       
      }
      else{
         res.send("Something went wrong on server!");
         console.log("Something went wrong when you upload file (This error can be due to file size ,which is handle by a middleware in this admin_Route page .....)")
      }
     return 
   } 
 })

// admin_Route.get('/allEmailsEvent',adminControler.sendEmailsToAllUserEventLoad);
// admin_Route.post('/allEmailsEvent',adminControler.sendEmailsToAllUserEvent);

module.exports = admin_Route ;
