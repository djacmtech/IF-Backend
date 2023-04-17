const db = require("../models");
const user = db.user; //user table from db

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const mime = require("mime-types");
const fs = require("fs");

const register = require("../middleware/register.js");
const login = require("../middleware/login.js");
const { cloudinaryUploadPdf } = require("../middleware/upload.cloudinary.js");

const members = require("../membership/members.js")

const SALT = 10;
//create or Register
exports.register = async (req, res) => {
  try {
    console.log(req.body);

    const checkData = {
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    };
    const { error } = register.registerValidate(checkData);
    if (error) {
      console.log(error);
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    const User = await user.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (User) {
      return res.status(400).send({
        message: "User already registered",
      });
    }

    if (!req.file) {
      return res.status(400).send({
        message: "Resume can not be empty",
      });
    }
    const localPath = `resources/pdfs/${req.file.filename}`;
    const uploadedPdf = await cloudinaryUploadPdf(localPath);
    const pdfurl = uploadedPdf.url;
    
    fs.unlink(localPath, (err) => {
      if (err) {
        console.log('Failed to delete local file:', err);
      } else {
        console.log('Local file deleted successfully.');
      }
    });

    if (req.body.password != req.body.confirmPassword) {
      return res.status(400).send({
        message: "Password does not match",
      });
    }

    const salt = await bcrypt.genSalt(SALT);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let creds = 0;

    if(members.includes(req.body.sap)){
      creds = 3;
    }else{
      creds = 0;
    }

    // if (parseInt(req.body.acmMember, 10) === 1) {
    //   creds = 3;
    // } else {
    //   creds = 0;
    // }
    //data to be saved
    const UserData = await user.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      sap: req.body.sap,
      contact: req.body.contact,
      gender: req.body.gender,
      graduationYear: req.body.graduationYear,
      academicYear: req.body.academicYear,
      department: req.body.department,
      acmMember: creds,
      resume: pdfurl,
    });

    //jwt token and sign
    const token = jwt.sign(
      {
        id: UserData.id,
        email: UserData.email,
      },
      process.env.JWT_SECRET
    );
    return res.status(200).send({
      message: "user registered successfully",
      data: UserData,
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: err.message || "Some error occurred while creating the user.",
    });
  }
};

//login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //collect data
    const checkData = {
      email: req.body.email,
      password: req.body.password,
    };

    //checks if feilds are filled or not
    const { error } = login.loginValidate(checkData);
    if (error) {
      console.log(error);
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    //query the db to find corresponding data
    const User = await user.findOne({
      where: {
        email: req.body.email,
      },
    });

    //if query not found
    if (!User) {
      return res.status(400).send({
        message: "User not found",
      });
    }
    //crosscheck pwd
    const validPassword = await bcrypt.compare(
      req.body.password,
      User.password
    );
    if (!validPassword) {
      return res.status(400).send({
        message: "Invalid password",
      });
    }
    const token = jwt.sign(
      {
        id: User.id,
        email: User.email,
      },
      process.env.JWT_SECRET
    );
    return res.status(200).send({
      message: "User logged in successfully",
      data: User,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message:
        error.message || "Some error occurred while logging in the User.",
    });
  }
};

//find in db
exports.findAll = async (req, res) => {
  try {
    const users = await user.findAll();
    return res.status(200).send({
      message: "user found successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message || "Some error occurred while finding the user.",
    });
  }
};

//find by id
exports.findOne = async (req, res) => {
  try {
    const { id } = req.body;
    const User = await user.findByPk(id);
    if (!User) {
      return res.status(400).send({
        message: "User not found",
      });
    }
    return res.status(200).send({
      message: "user found successfully",
      data: User,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message || "Some error occurred while finding the user.",
    });
  }
}
