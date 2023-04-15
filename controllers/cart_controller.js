const db = require("../models");
const cart = db.cart;
const job = db.job;

exports.addTocart = async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    //find cart with userId
    const cartData = await cart.findOne({
      where: {
        userId,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message || "error.",
    });
  }
};
//find in db

exports.getCart = async (req, res) => {
  try {
    const { userId } = req.body;
    //find cart in db and then include jobs from jobs table in cartData
    const cartData = await cart.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: job,
          as: "job",
          attributes: ["id", "role"],
        },  
      ],
    });
    if (!cartData) {
      return res.status(200).send({
        message: "No jobs in cart",
      });
    }
    return res.status(200).send({
      message: "Jobs in cart",
      data: cartData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message || "error.",
    });
  }
};
