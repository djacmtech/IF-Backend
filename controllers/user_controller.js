const db = require("../models");
const user = db.user; //user table from db
const cart = db.cart; //cart table from db
const order = db.order; //order table from db
const job = db.job; //job table from db

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const mime = require("mime-types");
const fs = require("fs");

const register = require("../middleware/register.js");
const login = require("../middleware/login.js");
const { cloudinaryUploadPdf } = require("../middleware/upload.cloudinary.js");

const members = require("../membership/members.js");

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

    //was used to upload pdf to cloudinary but now we are using resume url

    // if (!req.file) {
    //   return res.status(400).send({
    //     message: "Resume can not be empty",
    //   });
    // }
    // const localPath = `resources/pdfs/${req.file.filename}`;
    // const uploadedPdf = await cloudinaryUploadPdf(localPath);
    // const pdfurl = uploadedPdf.url;

    // fs.unlink(localPath, (err) => {
    //   if (err) {
    //     console.log('Failed to delete local file:', err);
    //   } else {
    //     console.log('Local file deleted successfully.');
    //   }
    // });

    if (req.body.password != req.body.confirmPassword) {
      return res.status(400).send({
        message: "Password does not match",
      });
    }

    const salt = await bcrypt.genSalt(SALT);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let creds = 0;

    if (members.includes(req.body.sap)) {
      creds = 3;
    } else {
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
      resume: req.body.resume,
    });

    //jwt token and sign
    const token = jwt.sign(
      {
        id: UserData.id,
        email: UserData.email,
      },
      process.env.JWT_SECRET
    );

    //create cart for user
    const cartData = await cart.create({
      userId: UserData.id,
    });

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
};

//find all users and their orders and orders should hold job data
exports.findAllUsersWithOrders = async (req, res) => {
  try {
    const users = await user.findAll({
      include: [
        {
          model: order,
          include: [
            {
              model: job,
            },
          ],
        },
      ],
    });
    return res.status(200).send({
      message: "user data found successfully",
      data: users,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: err.message || "Some error occurred while finding the user.",
    });
  }
};

//change password
exports.forgotPassword = async (req, res) => {
  try {
    const User = await user.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!User) {
      return res.status(400).send({
        message: "User not found",
      });
    }
    if (req.body.password != req.body.confirmPassword) {
      return res.status(400).send({
        message: "Password does not match",
      });
    }
    const salt = await bcrypt.genSalt(SALT);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const updatedUser = await User.update({
      password: hashedPassword,
    });
    return res.status(200).send({
      message: "password changed successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message || "Some error occurred while changing password.",
    });
  }
};

exports.autoLogin = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database
    const userData = await user.findOne({
      where: { email: decodedData.email },
    });
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ result: userData, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const { userId, resume } = req.body;
    const updatedUser = await user.update(
      {
        resume: resume,
      },
      {
        where: {
          id: userId,
        },
      }
    );
    return res.status(200).send({
      message: "user updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message || "Some error occurred while updating the user.",
    });
  }
};

//make a controller to fetch all users and jobs they have applied for
exports.findUserWithJobs = async (req, res) => {
  try {
    //find users which have orders
    const users = await user.findAll({
      include: [
        {
          model: order,
          include: [
            {
              model: job,
            },
          ],
        },
      ],
    });
    //check if the orders have jobs
    const filteredUsers = users.filter((user) => {
      return user.orders.length > 0;
    }
    );
    //make a new array of objects which have id, name, email of the users and company names they have applied for
    //users and the company names they have applied for
    const usersWithJobs = filteredUsers.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        jobs: user.orders.map((order) => {
          return order.jobs[0].company;
        }),
      };
    });
    return res.status(200).send({
      message: "user data found successfully",
      length: usersWithJobs.length,
      data: usersWithJobs,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: err.message || "Some error occurred while finding the user.",
    });
  }
};
