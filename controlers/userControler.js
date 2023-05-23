const User = require("../models/userModel");
const Subscriber = require("../models/subscriberModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

const { render } = require("../Routes/userRoute");

//  Send the Varification email by multer.........................
const sendverifyMail = async (fname, lastname, email, user_id) => {
  try {
    const verificationLink = `http://127.0.0.1:${process.env.PORT}/mailVerifyPage?id=${user_id}`;
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
      subject: "Email varification mail ",
      html:`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f8f8;
          }
          h1 {
            color: #333333;
            font-size: 24px;
            margin-top: 0;
          }
          p {
            color: #666666;
            font-size: 16px;
            line-height: 1.5;
          }
          .cta-button {
            display: inline-block;
            padding: 10px 20px;
            border:2px solid #0D6EFD;
            text-decoration: none;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Email Verification</h1>
          <p>Hello ${fname} ${lastname},</p>
          <p>Thank you for signing up. To verify your email, please click the button below:</p>
          <a  href="${verificationLink}" class="cta-button">Verify Email</a>
        </div>
      </body>
      </html>
    `   ,
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

//  Function generate hash password by bcrypt;
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

// Send  mail when user wants to forget the password.........
const sendResetPasswordMail = async (fname, lastname, email, token) => {
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
      subject: "For Reset the password ",
      html:
        "<p>Hi " +
        fname +
        " " +
        lastname +
        ' please click here to <a href="http://127.0.0.1:' +
        process.env.PORT +
        "/forgetPassword?token=" +
        token +
        ' "> Reset <a/> your password <p/>',
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err.message);
      } else {
        console.log("email has been sent - ", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

// Load the login Page-----------------
const loadLogin = async (req, res) => {
  try {
    res.clearCookie('user');
    res.render("userLogin");
  } catch (error) {
    console.log(error.message);
  }
};

// load the resister......
const resisterLoad = async (req, res) => {
  try {
    res.render("resister");
  } catch (error) {
    console.log(error.message);
  }
};




//==================== insert the users =============================
const {validationResult} = require("express-validator")

const insertUser = async (req, res) => {
     try { 
// ------------------------------------------------
      const errors = validationResult(req);
      // console.log(req.file)
      if(!errors.isEmpty()){
      
        // console.log(JSON.stringify(errors.array(), null, 2));
        
        res.render("resister", { message1: errors['errors'][0]});
        return;
      }
      else{

        const check = await User.findOne({ email: req.body.email });
        
        if (!check) {
          
          const securepass = await securePassword(req.body.password);

          const user = new User({
            fname: req.body.fname,
            lastname: req.body.lastname,
            password: securepass,
            gender: req.body.gender,
            email: req.body.email,
            mobile: req.body.mobile,
            image: req.file.filename,
            DOB: req.body.DOB,
            is_admin: 0,
          });

          const userData = await user.save();

          if (userData) {
            sendverifyMail(
              req.body.fname,
              req.body.lastname,
              req.body.email,
              userData._id
            );

            res.render("resister", {
              message: "your resistration is successful check email and varify yourself",
            });
          } else {
            res.render("resister", {
              message: "your resistration is not successful Please try again....",
            });
          }
        } else {
          res.render("resister", { message: "This email user already exist" });
        }
      }
  } catch (error) {
    console.log(error.message);
  }
};





// load view of ofter click on varification link on ..........
const userMailVerifyLoad = async (req, res) => {
  try {
    const id = req.query.id;
    const updatedInfo = await User.updateOne(
      { _id: id },
      { $set: { is_varified: 1 } }
    );
    res.render("mailVerifypage");
    console.log(updatedInfo);
  } catch (error) {
    console.log(error.message);
  }
};

// Verify the login credential
const loginVerification = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);

      if (passwordMatch) {
        if (userData.is_varified == 1) {

          const session = (req.session.user_id = userData._id);
           res.cookie('user',JSON.stringify(userData._id),{
            // maxAge:30000,
           });
          res.redirect("/userDashboard");
          
        } else {
          res.render("userLogin", {
            message: "Your email is not varified, Please varify it",
          });
        }
      } else {
        res.render("userLogin", {
          message: "your email or password incorrect",
        });
      }
    } else {
      res.render("userLogin", { message: "your email or password incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};


// User Dashboard load
const userDashboard = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id });
    res.render("userDashboard", { user: userData });
    // res.render('userDashboard')
  } catch (error) {
    console.log(error.message);
  }
};

// load the view for send the email for update the password...................
const sendForgetPassMail = async (req, res) => {
  try {
    res.render("sendForgetPassMail", {
      Smessage: "Secure your password and make your data safe.",
    });
  } catch (error) {
    console.log(error.message);
  }
};


// Verify the email for forget pass ......................................................
const forgetPassVarify = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });
    if (userData) {
      if (userData.is_varified === 0) {
        res.render("sendForgetPassMail", {
          message: "Your email is not varified,Please varify it from login page",
        });
      } else {
        const randomString = randomstring.generate();
        const updateUser = await User.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        console.log(updateUser);
        sendResetPasswordMail(
          userData.fname,
          userData.lastname,
          userData.email,
          randomString
        );
        res.render("sendForgetPassMail", {
          message:
            "Please check your email to 'Reset' your password by given link.",
        });
      }
    } else {
      res.render("sendForgetPassMail", { message: "Your email is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// final reset password view(forgetPassword)............

const forgetPasswordLoad = async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await User.findOne({ token: token });
    if (tokenData) {
      // console.log(tokenData);
      // console.log(tokenData._id);
      res.render("forgetPassword", {
        user_id: tokenData._id,
        Smessage:
          "New password must have minimum 8 character and has atleast one upper ,one lower and one number.",
      });
    } else {
      res.render("404", {
        message: "Something went wrong ,Your token is not valied, please retry.",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const forgetPassword = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const passward = req.body.password;
    const confPassword = req.body.confPassword;
    const pass1 = await securePassword(passward);
    const pass2 = await securePassword(confPassword);
    // console.log(pass1,pass2);
    if (passward == confPassword) {
      const userData = await User.findByIdAndUpdate(
        { _id: user_id },
        { $set: { password: pass2, token: "" } }
      );
      res.redirect("/login");
    } else {
      const userdata = await User.findOne({ _id: user_id });
      res.render("forgetPassword", {
        user_id: userdata._id,
        message: "Both password field not matches ",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Directally Email varify.................
const directEmailVerifyLoad = async (req, res) => {
  try {
    res.render("directEmailVarify");
  } catch (error) {
    console.log(error.message);
  }
};

const directEmailVerify = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });
    if (userData) {
      sendverifyMail(
        userData.fname,
        userData.lastname,
        userData.email,
        userData._id
      );
      res.render("directEmailVarify", {
        message: "Link is send to on your email, Please check it.",
      });
    } else {
      res.render("directEmailVarify", {
        message: "Your email is invalid, Please checki it ?",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//Logout the user

const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.clearCookie('user');
    res.redirect("/login");
  } catch (error) {
    console.log(error.message);
  }
};

// Update the user profile.........................................
// const updateProfileLoad = async (req, res) => {
//   try {
//     const user_id = req.query.id;
//     const userData = await User.findOne({ _id: user_id });

//     res.render("updateProfile", { user: userData });
//   } catch (error) {
//     console.log(error.message);
//   }
// };

const updateProfile = async (req, res) => {
  try {
    if (req.file) {
      const updatedProfileInfo = await User.findByIdAndUpdate(
        { _id: req.body.user_id },
        {
          $set: {
            fname: req.body.fname,
            lastname: req.body.lastname,
            email: req.body.email,
            mobile: req.body.mobile,
            gender: req.body.gender,
            DOB: req.body.DOB,
            image: req.file.filename,
          },
        }
      );
    } else {
      const updatedProfileInfo = await User.findByIdAndUpdate(
        { _id: req.body.user_id },
        {
          $set: {
            fname: req.body.fname,
            lastname: req.body.lastname,
            email: req.body.email,
            mobile: req.body.mobile,
            gender: req.body.gender,
            DOB: req.body.DOB,
          },
        }
      );
    }
    res.redirect("/userDashboard");
  } catch (error) {
    console.log(error.message);
  }
};



// ------- Save the subscriber data 

const subscribeUsers = async(req,res)=>{
  try {
    
    const userEmail = req.body.Email;
    const subscriber= new Subscriber(
      {
        Email:userEmail
      }
    );

   const subData =  await subscriber.save()
   
      res.redirect('/');
   

  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  loadLogin,
  resisterLoad,
  insertUser,
  userMailVerifyLoad,
  userDashboard,
  loginVerification,
  sendForgetPassMail,
  forgetPassVarify,
  forgetPasswordLoad,
  forgetPassword,
  directEmailVerifyLoad,
  directEmailVerify,
  logout,
  // updateProfileLoad,
  updateProfile,
  subscribeUsers
};
