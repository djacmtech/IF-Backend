const db = require("../models");
const job = db.job; //user table from db
const Op = db.Sequelize.Op;
const fs = require("fs");
//const cloudinary = require("../middleware/upload.image.js");
const { cloudinaryUploadLogo } = require("../middleware/upload.cloudinary.js");
//create
exports.create = async (req, res) => {
  try {
    console.log(req.body);
    if (!req.file) {
      return res.status(400).send({
        message: "Image can not be empty",
      });
    }

    const localPath = `resources/logos/${req.file.filename}`;
    const uploadedLogo = await cloudinaryUploadLogo(localPath);
    const logourl = uploadedLogo.url;
    fs.unlink(localPath, (err) => {
      if (err) {
        console.log('Failed to delete local file:', err);
      } else {
        console.log('Local file deleted successfully.');
      }
    });

    let stipendData = (req.body.lowStipend == req.body.highStipend) ? (req.body.highStipend) : (req.body.lowStipend + "-" + req.body.highStipend);

    const Job = await job.create({
      role: req.body.role,
      company: req.body.company,
      location: req.body.location,
      mode: req.body.mode,
      stipend: stipendData,
      lowStipend: req.body.lowStipend,
      highStipend: req.body.highStipend,
      duration: req.body.duration,
      about: req.body.about,
      about: req.body.about,
      description: req.body.description,
      link: req.body.link,
      requirements: req.body.requirements,
      skills: req.body.skills,
      perks: req.body.perks,
      logo: logourl,
    });
    res.status(200).send({
      message: "Job added successfully",
      data: Job,
    });
  } catch (error) {
    console.log(error);
  }
};

//find in db
exports.findAll = async (req, res) => {
  try {
    const { lowStipend, highStipend, mode, role } = req.body; //lowStipend, highStipend, mode, role
    let where = {};
    if (lowStipend && highStipend) {
      where = {
        ...where,
        //put in or condition
        [Op.or]: [
          {
            lowStipend: {
              [Op.between]: [lowStipend, highStipend],
            },
          },
          {
            highStipend: {
              [Op.between]: [lowStipend, highStipend],
            },
          },
        ],
      };
    }
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
    //parse links requirments skills perks to JSON 
    Jobs.forEach((job) => {
      job.requirements = JSON.parse(job.requirements);
      job.skills = JSON.parse(job.skills);
      job.perks = JSON.parse(job.perks);
      job.link = JSON.parse(job.link);
    });

    res.status(200).send({
      message: "Jobs fetched successfully",
      data: Jobs,
    });
  } catch (error) {
    console.log(error);
  }
};

//find in db
exports.findOne = async (req, res) => {
  try {
    const { id } = req.body;
    const Job = await job.findByPk(id);
    if (Job) {
      res.status(200).send({
        message: "Job fetched successfully",
        data: Job,
      });
    } else {
      res.status(404).send({
        message: "Job not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//find in db 
exports.viewJob = async (req, res) => {
  try{
    console.log("hello")
    const { jobId } = req.params;
    const Job = await job.findByPk(jobId);

    //parse links requirments skills perks to JSON
    Job.requirements = JSON.parse(Job.requirements);
    Job.skills = JSON.parse(Job.skills);
    Job.perks = JSON.parse(Job.perks);
    Job.link = JSON.parse(Job.link);
    
    if (Job) {
      res.status(200).send({
        message: "Job fetched successfully",
        data: Job,
      });
    } else {
      res.status(404).send({
        message: "Job not found",
      });
    }
  }catch(error){
    console.log(error);
    return res.status(500).send({
      message: "Error retrieving Job with id=" + jobId,
      error: error,
    });
  }
}
