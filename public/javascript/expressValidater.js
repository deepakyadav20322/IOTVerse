const { check } = require("express-validator");

exports.insertUserValidation = [
//   check('fname','First name is required').not().isEmpty(),
//   check('fname').custom((value,{req})=>{
//       if(value !== undefined || value.length > 0){
//           return true;
//       }
//      else{
//       return false;
//      }
//   }).withMessage('First name is required'),

  check("fname", "First name should be characters without space")
    .not()
    .isEmpty()
    .withMessage("First name is required")
    .isAlpha()
    .withMessage("First name should be characters without space"),

  check("lastname", "Last name should be characters without space.")
    .not()
    .isEmpty()
    .withMessage("Last name is required.")
    .isAlpha()
    .withMessage("Last name should be characters without space."),

  check("email", "Please give a valied email address.")
    .isEmail()
    .normalizeEmail(),

  check(
    "password",
    "password Must be greater than 6 character and contains at least one uppercase one lowercase and one numeric value."
  )
    .isLength({ min: 6 })
    .withMessage("password Must be greater than 6 character and contains at least one uppercase one lowercase and one numeric value.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number."
    ),

  check(
    "mobile",
    "Your mobile number is not correct. It must be numeric and 10 digits."
  )
    .isInt({ min: 0, allow_leading_zeroes: false })
    .isLength({ min: 10, max: 10 }),


  check("image")
    .custom((value, { req }) => {
      if (
        req.file.mimetype === "image/jpeg" ||
        req.file.mimetype === "image/jpg" ||
        req.file.mimetype === "image/png" &&  req.file.size <300*1000
      ) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("Please upload jpeg/jpg/png file and with size less than 300kb "),
];




// ----------------------- Vlidation for add event by admin -----------------------

exports.addEventValidation = [
  check("eventName", "First name should be characters")
  .not()
  .isEmpty()
  .withMessage("First name is required and have ony character")
  .isAlpha("en-US", {ignore: " "})
  .withMessage("First name should only contain letters"),

  check("eventImage")
  .custom((value, { req }) => {
    if (req.file.mimetype == "image/png" || req.file.mimetype == "image/jpg" || req.file.mimetype == "image/jpeg" && req.file.size<1024*1024){
      return true;
    } else {
      return false;
    }
  })
  .withMessage("Please upload png file and with size less than 1Mb "),
];


// ----------------------------------- Validation for upload gallery Images  ------------------- 

exports.addGalleryValidation = [
  check("gallery")
    .custom((value, { req }) => {
      console.log('IN VALUE')
      console.log(req.file)
      if (req.file != undefined && (req.file.mimetype == "image/png" || req.file.mimetype == "image/jpg" || req.file.mimetype == "image/jpeg") && req.file.size<1024*1024){
        return true;
      } else {
        return false;
      }
    })
    .withMessage("Please upload png file and with size less than 1Mb "),
  
]