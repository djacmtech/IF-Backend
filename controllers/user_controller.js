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
          sap : req.body.sap,
          password: req.body.password,
          resume : req.body.resume,
          confirmPassword: req.body.confirmPassword,
        };
        const { error } = register.registerValidate(checkData);
        if (error) {
          console.log(error);
          return res.status(400).send(error.details[0].message);
        }

        const User = await user.findOne({
          where: {
            sap: req.body.sap,
          },
        });
        if (User) {
          return res.status(400).send("user already registered.");
        }

        //validate pdf
        const checkPDF = res.headers['content-type'];
        const mimeType = mime.getType(checkPDF);
        if (mimeType === 'application/pdf'){
            //idk what to write here... acc to google continue aana chaiye
        }
        else{
            return res.status(400).send("please enter valid file in pdf")
        }

        //yeh ig hona chaiye validate
        if(password != confirmPassword){
            console.log(error);
            return res.status(400).send("password mismatch");
        }
        
        //genSalt does hashing Salt is random value added to pwd
        const salt = await bcrypt.genSalt(SALT);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //data to be saved
        await Admin.create({
          ...req.body,
          password: hashedPassword,
        });
        res.send({ data: req.body });
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
      }
    };

//login user
exports.login = async(req,res) => {
    try {

        //collect data
        const checkData = {
            email : req.body.email,
            sap : req.body.sap,
            password : req.body.password

        };

        //checks if feilds are filled or not
        const { error } = login.loginValidate(checkData);
        if(error){
            console.log(error);
            return res(400).send(error.details[0].message);
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
            return res.status(400).send("enter correct details");
        }
        //crosscheck pwd 
        const validPassword = await bcrypt.compare(
            req.body.password,
            admin.password
        );
        if (!validPassword) {
            return res.status(400).send("enter correct password");
        }
        res.send({
            data:user,
        });
    } 
    catch(error) {
            console.log(error);
            res.status(500).send(error);
    }
};

//find in db
exports.findAll = async (req, res) => {
    try{
        const users = await User.findAll();
        res.send(users);
    }catch(error){
        console.log(error);
    }
}