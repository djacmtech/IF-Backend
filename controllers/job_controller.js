const db = require('../models');
const job = db.job; //user table from db
const Op = db.Sequelize.Op;

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
        const { lowStipend, highStipend, mode, role } = req.body; 
        // let where = {};
        // if (lowStipend && highStipend) {
        //     where = {
        //         ...where,
        //         stipend: {
        //             [Op.between]: [lowStipend, highStipend],
        //         },
        //     };
        // }

        //not working
        const where = {
            [Op.or]: [{
                stipend: {
                    [Op.between]: [lowStipend, highStipend]
                }
            
            }]
        };

        if (mode) {
            where = {
                ...where,
                mode: {
                    [Op.like]: `%${mode}%`,
                },
            };
        }
        if (role) {
            where = {
                ...where,
                role: {
                    [Op.like]: `%${role}%`,
                },
            };
        }
        const Jobs = await job.findAll({
            where,
        });
        if (Jobs.length === 0) {
            return res.status(200).send({
                message: "No Jobs found",
            });
        }
        res.status(200).send({
            message: "Jobs fetched successfully",
            data: Jobs
        });
    }catch(error){
        console.log(error);
    }
};
