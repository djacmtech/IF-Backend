const db = require('../models');
const job = db.job; //user table from db

const cloudinary = require("../middleware/upload.image.js");

//pls check krlena....tera hi code hai..bas changes karre hai
//checked and changes done
//will store the logos in google drive so no cloudinary required to reduce the load on cloudinary
exports.create = async (req, res) => {
    try{
        console.log(req.body);
        const Job = await job.create(req.body);
        res.status(200).send({
            message: "Job added successfully",
            data: Job
        });
    }catch(error){
        console.log(error);
    }
};



//find in db
exports.findAll = async (req, res) => {
    try{
        const Jobs = await job.findAll();
        res.status(200).send({
            message: "Jobs fetched successfully",
            data: Jobs
        });
    }catch(error){
        console.log(error);
    }
};
