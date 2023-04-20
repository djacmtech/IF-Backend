const db = require("../models");
const cart = db.cart;
const job = db.job;
const user = db.user;
const order = db.order;

exports.addTocart = async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    //find cart in db and then include jobs from jobs table in cartData
    let cartData = await cart.findOne({
      where: {
        userId,
      },
      include: [
        {
          model: job,
        },
      ],
    });
    //if cart is not found then create new cart
    if (!cartData) {
      cartData = await cart.create({
        userId,
      });
    }
    //if cart is found then check if the job is already in cart or not
    if (cartData?.jobs.length > 0) {
      const jobFound = cartData.jobs.find((job) => job.id === parseInt(jobId, 10));
      if (jobFound) {
        return res.status(400).send({
          message: "Job already in cart",
        });
      }
    }

    //find all orders of user
    const userOrders = await order.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: job,
        },
      ],
    });

    //check if the job is already ordered
    if (userOrders.length > 0) {
      for (let i = 0; i < userOrders.length; i++) {
        console.log(userOrders[i])
        const jobFound = userOrders[i].jobs.find((job) => job.id === parseInt(jobId, 10));
        if (jobFound) {
          return res.status(400).send({
            message: "Job already ordered",
          });
        }
      }
    }

    //if job is not in cart then add it to cart
    await cartData.addJob(jobId);
    
    cartData = await cart.findOne({
      where: {
        id: cartData.id,
      },
      include: [
        {
          model: job,
        },
      ],
    });
    return res.status(200).send({
      message: "Job added to cart",
      data: cartData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message || "error.",
    });
  }
};

//remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    //find cart in db and then include jobs from jobs table in cartData
    let cartData = await cart.findOne({
      where: {
        userId,
      },
      include: [
        {
          model: job,
        },
      ],
    });
    //if cart is not found then return error
    if (!cartData) {
      return res.status(404).send({
        message: "Cart not found",
      });
    }
    //if cart is found then check if the job is already in cart or not
    if (cartData?.jobs.length > 0) {
      const jobFound = cartData.jobs.find((job) => job.id === parseInt(jobId, 10));
      if (!jobFound) {
        return res.status(400).send({
          message: "Job not in cart",
        });
      }
    }
    //if job is in cart then remove it from cart
    await cartData.removeJob(jobId);
    cartData = await cart.findOne({
      where: {
        id: cartData.id,
      },
      include: [
        {
          model: job,
        },
      ],
    });
    return res.status(200).send({
      message: "Job removed from cart",
      data: cartData,
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
    let cartData = await cart.findOne({
      where: {
        userId,
      },
      include: [
        {
          model: job,
        },
      ],
    });
    if(!cartData){
        return res.status(404).send({
            message: "Cart not found"
        });
    }
    return res.status(200).send({
      message: "Cart found",
      data: cartData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message || "error.",
    });
  }
};
