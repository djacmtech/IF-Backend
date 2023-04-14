const db = require("../models");
const cart = db.cart;
const job = db.job;

exports.addTocart = async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    const cartData = await cart.findOne({
      where: {
        userId,
      },
    });
    if (cartData) {
      const { jobs } = cartData;
      jobs.push(jobId);
      await cart.update(
        {
          jobs,
        },
        {
          where: {
            userId,
          },
        }
      );
    } else {
      await cart.create({
        userId,
        jobs: [jobId],
      });
    }
    return res.status(200).send({
      message: "Job added to cart successfully",
    });
  } catch (error) {
    console.log(err);
    return res.status(500).send({
      message: err.message || "error.",
    });
  }
};
//find in db

exports.getCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const cartData = await cart.findOne({
      where: {
        userId,
      },
    });
    if (cartData) {
      //get jobs from job table
      const { jobs } = cartData;
      const jobsData = await job.findAll({
        where: {
          id: jobs,
        },
      });
      return res.status(200).send({
        message: "Cart data fetched successfully",
        data: jobsData,
      });
    } else {
      return res.status(200).send({
        message: "Cart data fetched successfully",
        data: [],
      });
    }
  } catch (error) {
    console.log(err);
    return res.status(500).send({
      message: err.message || "error.",
    });
  }
};
