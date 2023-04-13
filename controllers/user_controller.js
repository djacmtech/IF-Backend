const db = require('../models');
const user = db.user; //user table from db

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const mime = require('mime-types');

const register = require("../middleware/register.js");
const login = require("../middleware/login.js");

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

        //get pdf from req files and store it on cloudinary and store the link in db
        const file = req.files.file;
        const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath);
        console.log(uploadResponse);
        const pdfurl = uploadResponse.url;

        //validate pdf
        /*const checkPDF = res.headers['content-type'];
        const mimeType = mime.getType(checkPDF);
        if (mimeType === 'application/pdf'){
            //idk what to write here... acc to google continue aana chaiye
        }
        else{
            return res.status(400).send("please enter valid file in pdf")
        }*/

        //yeh ig hona chaiye validate
        if(req.body.password != req.body.confirmPassword){
            return res.status(400).send({
                message: "Password does not match",
            });
        }
        
        //genSalt does hashing Salt is random value added to pwd
        const salt = await bcrypt.genSalt(SALT);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //data to be saved
        await user.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            sap: req.body.sap,
            contact: req.body.contact,
            gender: req.body.gender,
            graduationYear: req.body.graduationYear,
            academicYear : req.body.academicYear,
            department: req.body.department,
            acmMember: req.body.acmMember,
            resume: pdfurl,
        });
        return res.status(200).send({
            message: "user registered successfully",
            data: User,
        });
      } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: err.message || "Some error occurred while creating the user.",
        });
      }
    };

//login user
exports.login = async(req,res) => {
    try {

        //collect data
        const checkData = {
            email : req.body.email,
            password : req.body.password
        };

        //checks if feilds are filled or not
        const { error } = login.loginValidate(checkData);
        if(error){
            console.log(error);
            return res(400).send({
                message: error.details[0].message,
            });
        }

        //query the db to find corresponding data
        const user = await user.findOne({
            where : {
                email :req.body.email,
                sap :req.body.sap,
            },
        });

        //if query not found
        if (!user){
            return res.status(400).send({
                message: "User not found",
            });
        }
        //crosscheck pwd 
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword) {
            return res.status(400).send({
                message: "Invalid password",
            });
        }
        return res.status(200).send({
            message: "user logged in successfully",
            data: user,
        });
    } 
    catch(error) {
            console.log(error);
            return res.status(500).send({
                message: error.message || "Some error occurred while logging in the user.",
            });
    }
};

//find in db
exports.findAll = async (req, res) => {
    try{
        const users = await user.findAll();
        return res.status(200).send({
            message: "user found successfully",
            data: users,
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            message: error.message || "Some error occurred while finding the user.",
        });
    }
}