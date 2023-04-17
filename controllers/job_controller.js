const db = require("../models");
const job = db.job; //user table from db
const Op = db.Sequelize.Op;

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

    const Job = await job.create({
      role: req.body.role,
      company: req.body.company,
      location: req.body.location,
      mode: req.body.mode,
      stipend: req.body.stipend,
      duration: req.body.duration,
      about: req.body.about,
      about: req.body.about,
      description: req.body.description,
      link: req.body.link,
      requirement: req.body.requirement,
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
        stipend: {
          [Op.between]: [lowStipend, highStipend],
        },
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
