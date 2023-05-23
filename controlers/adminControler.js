const User = require("../models/userModel");
const Event = require("../models/eventModel");
const Gallery = require("../models/galleryModel");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const exceljs = require("exceljs");
const {validationResult} = require("express-validator")


// hasing to secure the password..............
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};


// Send email to all users for notify the upcomming events-------------------

const sendMailToAllUsersEvent = (emailList,emailContent,emailSubject)=>{
  try {
    const transporter = nodemailer.createTransport({
      host:"smtp.gmail.com",
      secure:false,
      auth:{
        user:process.env.emailUser,
        pass:process.env.emailPassword,
      },
    });

   const mailOptions = {
         from:process.env.emailUser,
         to:emailList,
         subject:'Event related',
         html:'<p>'+emailContent+'</p>',
   };
   transporter.sendMail(mailOptions,function(err,info){
    if (err) {
      console.log(err.message);
    } else {
      console.log("Email has been sent - ", info.response);
    }
   })

  } catch (error) {
    console.log(error.message);
  }
}



// Ofter adding user by admin send the mail to the user Email.............
const addUserMail = async (fname, lastname, email, password, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: false,
      requireTls: true,
      auth: {
        user: process.env.emailUser,
        pass: process.env.emailPassword,
      },
    });

    const mailOptions = {
      from: process.env.emailUser,
      to: email,
      subject: "For Email Varification",
      html:
        "<p>Hi " +
        fname +
        " " +
        lastname +
        ' please click here to <a href="http://127.0.0.1:' +
        process.env.PORT +
        "/mailVerifypage?id=" +
        user_id +
        ' ">verify<a/> your mail.<p/> <br> <b>Email :- </b>'+email+'<br> <b>Password :- </b>'+password+" ",
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err.message);
      } else {
        console.log("Email has been sent - ", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};


const adminLoginLoad = async (req, res) => {
  try {
    res.render("adminLogin");
  } catch (error) {
    console.log(error.message);
  }
};

// Admin login verify

const adminLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const adminData = await User.findOne({ email: email });

    if (adminData) {
      const passwordMatch = await bcrypt.compare(password, adminData.password);
      if (passwordMatch) {
        if (adminData.is_admin === 0) {
          res.render("adminLogin", {
            message: "Your email or password is invalied",
          });
        } else {
          req.session.admin_id = adminData._id;

          res.redirect("/admin/adminDashboard");
        }
      } else {
        res.render("adminLogin", {
          message: "email and password are incorrect",
        });
      }
    } else {
      res.render("adminLogin", {
        message: "Your email or password is invalied",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Admin DAashboard view.......
const adminDashboardLoad = async (req, res) => {
  try {
    const adminData = await User.findOne({ _id: req.session.admin_id });
    if (adminData) {
      if (adminData.is_admin == 1) {
        var search = "";
        if (req.query.search) {
          search = req.query.search;
        }

        const allUserDataLength = (await User.find({ is_admin: 0 })).length;
        const varifiedUserLength = (
          await User.find({ is_admin: 0, is_varified: 1 })
        ).length;
        const notVarifiedUserLength = (
          await User.find({ is_admin: 0, is_varified: 0 })
        ).length;

        //    console.log(allUserDataLength);
        //    console.log(varifiedUserLength);
        //    console.log(notVarifiedUserLength);
        const userData = await User.find({
          is_admin: 0,
          $or: [
            { fname: { $regex: ".*" + search + ".*", $options: "i" } },
            { lastname: { $regex: ".*" + search + ".*", $options: "i" } },
            { email: { $regex: ".*" + search + ".*", $options: "i" } },

            //  {mobile:{$regex:'.*'+search+'.*',$options:'i'}},
          ],
        }).sort({ _id: -1 });

        res.render("adminDashboard", {
          admin: adminData,
          users: userData,
          usersLength: allUserDataLength,
          varifyUser: varifiedUserLength,
          notVarifyuser: notVarifiedUserLength,
        });
      } else {
        res.redirect("/admin/adminlogin");
      }
    } else {
      res.redirect("/admin/adminlogin");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin/adminLogin");
  } catch (error) {
    console.log(error.message);
  }
};

// Edite the user by Admin(load view) ...................

const editUserLoad = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await User.findById({ _id: id });
    if (userData) {
      res.render("editUser", { user: userData });
    } else {
      res.redirect("/admin/adminDashboard");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const editUser = async (req, res) => {
  try {
    const fname = req.body.fname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const DOB = req.body.DOB;
    const gender = req.body.gender;
    // const verify = req.body.verify;

    const updatedData = await User.findByIdAndUpdate(
      { _id: req.body.user_id },
      {
        $set: {
          fname: fname,
          lastname: lastname,
          email: email,
          mobile: mobile,
          DOB: DOB,
          gender: gender,
        },
      }
    );
    res.redirect("/admin/adminDashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// Add new user by Admin.........................

const newUserLoad = async (req, res) => {
  try {
    res.render("newUser");
  } catch (error) {
    console.log(error.message);
  }
};

// const {validationResult} = require("express-validator");

const newUserAdd = async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      
      res.render("newUser", { message1: errors['errors'][0]});
      return;
    }
    else{
      const check = await User.findOne({email:req.body.email})
       if (!check) {
    const fname = req.body.fname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const image = req.file.filename;
    const gender = req.body.gender;
    const DOB = req.body.DOB;
    const password = randomstring.generate(8);
    const spassword = await securePassword(password);
    const user = new User({
      fname: fname,
      lastname: lastname,
      email: email,
      mobile: mobile,
      image: image,
      DOB: DOB,
      password: spassword,
      gender: gender,
      is_admin: 0,
    });

    const userData = await user.save();
    if (userData) {
      addUserMail(fname, lastname, email, password, userData._id);
      res.redirect("/admin/adminDashboard");
    } else {
      res.render("newUser", { message: "somthing went wrong..." });
    }
  }
  else {
res.render("newUser", { message: "This email user already exist" });
  }
}
  
  } catch (error) {
    console.log(error.message);
  }
};

// Delete the user by admin.........................
const deleteUser = async (req, res) => {
  try {
    const id = req.query.id;
    const deleteData = await User.deleteOne({ _id: id });
    res.redirect("/admin/adminDashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// ------------------------------ for add events functions -------------------------
const addEventLoad = async (req, res) => {
  try {
    res.render("addEvent");
  } catch (error) {
    console.log(error.message);
  }
};


const addEvent = async (req, res) => {
  try {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.render("addEvent", { message1: errors['errors'][0]});
      return;
    }

    else{
    const eventName = req.body.eventName;
    const eventSubname = req.body.eventSubname;
    const eventTime = req.body.eventTime;
    const eventdateStart = req.body.eventdateStart;
    const eventdateEnd = req.body.eventdateEnd;
    const eventDiscription = req.body.eventDiscription;
    const eventImage = req.file.filename;
    console.log(req.file)
    console.log(req.file.filename)
   
    const eventLocation = req.body.eventLocation;
    const eventId = req.body.eventName + "-ID";

    const event = new Event({
      eventName: eventName,
      eventSubname: eventSubname,
      eventTime: eventTime,
      eventdateStart: eventdateStart,
      eventdateEnd: eventdateEnd,
      eventDiscription: eventDiscription,
      eventImage: eventImage,
      eventLocation: eventLocation,
      eventId: eventId,
    });

    const eventData = await event.save();

    if (eventData) {
      res.redirect("/admin/adminDashboard");
    } else {
      res.render("addEvent", { message: "Something went wrong....." });
    }
  }
  } catch (error) {
    console.log(error.message);
  }

};
// Expor the Excel file of all users......... 
const exportUesrExcel = async (req, res) => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("My Users");

    worksheet.columns = [
      { header: "S no.", key: "s_no", width: "15" },
      { header: "FirstName.", key: "fname", width: "15" },
      { header: "LastName", key: "lastname", width: "15" },
      { header: "Email", key: "email", width: "15" },
      { header: "MObile no:", key: "mobile", width: "15" },
      { header: "Gender", key: "gender", width: "15" },
      { header: "D.O.B", key: "DOB", width: "15" },
    ];

    let counter = 1;

    const userData = await User.find({ is_admin: 0 });

    userData.forEach((user) => {
      user.s_no = counter;

      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };
      });
    });

    res.setHeader(
      "content-Type",
      "application-vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "content-Disposition",
      `attachment; filename = IOTusers.xlsx`
    );
    return workbook.xlsx.write(res).then(() => {
      res.status(200);
    });
  } catch (error) {
    console.log(error.message);
  }
};

const adminEventPageLoad = async (req, res) => {
  try {
    const events = await Event.find();
    const currentDate = new Date();
    const pastEvents = await Event.find({
      eventdateStart: { $lt: currentDate },
    }).exec();

    const eventLength = events.length;
    const pastEventsLength = pastEvents.length;
    const commingEventLength = eventLength - pastEventsLength;

    // console.log(eventLength);
    // console.log(pastEvents.length);
    // console.log(pastEvents);
    res.render("adminEventPage", {
      events: events,
      pastEvents: pastEventsLength,
      commingEvent: commingEventLength,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const updateEventLoad = async (req, res) => {
  try {
    const id = req.query.id;
    const eventData = await Event.findById({ _id: id });
    if (eventData) {
      res.render("updateEvent", { event: eventData });
    } else {
      res.redirect("/admin/adminEventPage");
    }
  } catch (error) {
    console.log(error.message);
  }
};


const updateEvent = async (req, res) => {
  try {

    const eventName = req.body.eventName;
    const eventSubname = req.body.eventSubname;
    const eventTime = req.body.eventTime;
    const eventdateStart = req.body.eventdateStart;
    const eventdateEnd = req.body.eventdateEnd;
    const eventDiscription = req.body.eventDiscription;
    const eventLocation = req.body.eventLocation;
    if (req.file) {
      const eventImage = req.file.filename;
      const updatedEventData = await Event.findByIdAndUpdate(
        { _id: req.body.event_id },
        {
          $set: {
            eventName: eventName,
            eventSubname: eventSubname,
            eventTime: eventTime,
            eventdateStart: eventdateStart,
            eventdateEnd: eventdateEnd,
            eventImage: eventImage,
            eventLocation: eventLocation,
            eventDiscription: eventDiscription,
          },
        }
      );
    } else {
      const updatedEventData = await Event.findByIdAndUpdate(
        { _id: req.body.event_id },
        {
          $set: {
            eventName: eventName,
            eventSubname: eventSubname,
            eventTime: eventTime,
            eventdateStart: eventdateStart,
            eventdateEnd: eventdateEnd,
            eventLocation: eventLocation,
            eventDiscription: eventDiscription,
          },
        }
      );
    }

    res.redirect("/admin/adminEventPage");
  } 

  catch (error) {
    console.log(error.message);
  }
};


//  Delete the event by admin -----------
const deleteEvent = async(req,res)=>{
  try {
   const id = req.query.id;
  const deletedData = await Event.deleteOne({_id:id});
  console.log(deletedData);
  res.redirect('/admin/adminEventPage');


  } catch (error) {
    console.log(error.message);
  }
};

//Upload the gallery Image - ---------------------------------

const uploadGalleryImgLoad= async(req,res)=>{
  try {
    res.render('addGalleryImage');
  } catch (error) {
    console.log(error.message);
  }
};


const uploadGalleryImg = async(req,res)=>{

  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      console.log('error occures when upload gallery file');
      if(req.file){
        console.log("Files exixts");
        console.log(errors)
        console.log(req.file);
      }  
      
      res.render("addGalleryImage", { message1: errors['errors'][0]});
      return;
    }
    else{
      const ImgName = req.file.filename;
      const Imgpath = req.file.path;
     const galImg = new Gallery({
          name:ImgName,
          path:Imgpath,
     });
     const saveData = await galImg.save();
      
    if(saveData){
      console.log('error not occures')
      res.redirect('/admin/adminDashboard');
    }
    else{
      res.render('addGalleryImage',{message:"Something went wrong....."})
    }
   
  }
}
   catch (error) {
    console.log(error.message);
  }
}

// const uploadGalleryImg = async(req,res)=>{
//   try {

//     req.files
    
//   } catch (error) {
//     console.log(error.message);
//   }
// }

//Send the email to all users event notification(View)------------------------------
// const sendEmailsToAllUserEventLoad = async(req,res)=>{
//   try {
    
//    res.render('sendAllEmailEvent');

//   } catch (error) {
//     console.log(error.message);
//   }
// }


// const sendEmailsToAllUserEvent = async(req,res)=>{
//   try {
//     const allUsres = await User.find({});
//     const emails = allUsres.map((user)=>user.email);
//     const emailList = emails.join(',');
//     const emailSubject = req.body.emailSubject;
//     const emailContent = req.body.emailContent;
    
//     sendMailToAllUsersEvent(emailList,emailSubject,emailContent);
//     res.redirect('/admin/adminDashboard');


//   } catch (error) {
//     console.log(error.message);
//   }
// }

// ---------------------------------------------------------------------- 

module.exports = {
  adminLoginLoad,
  adminLogin,
  adminDashboardLoad,
  logout,
  editUserLoad,
  editUser,
  deleteUser,
  newUserLoad,
  newUserAdd,
  addEventLoad,
  addEvent,
  exportUesrExcel,
  adminEventPageLoad,
  updateEventLoad,
  updateEvent,
  deleteEvent,
  uploadGalleryImgLoad,
  uploadGalleryImg,
  // sendEmailsToAllUserEventLoad,
  // sendEmailsToAllUserEvent
};
