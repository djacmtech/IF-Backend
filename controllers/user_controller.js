const db = require('../../models');
const user = db.User; //user table from db

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//create or Register
exports.create = async (req, res) => {
    try{
        const User = await user.create(req.body);     
        res.send(User);
    }catch(error){
        console.log(error);
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