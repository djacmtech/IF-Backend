const db = require('../models');
const order = db.order;
const cart = db.cart;
const user = db.user;
const job = db.job;
const fs = require("fs");
const { cloudinaryUploadReceipt } = require("../middleware/upload.cloudinary.js");

exports.addOrder = async (req, res) => {
    try{
        const { userId } = req.body;
        console.log(userId)
        const userCart = await cart.findOne({
            where: {
                userId: userId
            },
            include: [
                {
                model: job
                }
            ]
        });

        let userOrderData = await order.findAll({
            where: {
                userId,
            },
            include: [
                {
                    model: job,
                },
            ],
        });

        if(!userCart){
            return res.status(404).send({
                message: "Cart not found."
            });
        }

        //check if jobs in cart
        if(userCart.jobs.length === 0){
            return res.status(404).send({
                message: "No jobs in cart."
            });
        }

        let userData = await user.findByPk(userId);
        if(!userData){
            return res.status(404).send({
                message: "User not found"
            });
        }

        //take acmMember value from user
        let credits = userData.acmMember;
        //take jobs from cart
        let jobs = userCart.jobs;
        //total price of jobs
        let totalPrice = 0;
        //discount
        let discount = 0;
        
        let companyNames = [];

        let prevCompanyNames = [];

        //make an array of unique company names
        jobs.forEach((job) => {
            if(!companyNames.includes(job.company)){
                companyNames.push(job.company);
            }
        });
        
        //get all unique company names from previous orders
        userOrderData.forEach((order) => {
            order.jobs.forEach((job) => {
                if(!prevCompanyNames.includes(job.company)){
                    prevCompanyNames.push(job.company);
                }
            });
        });

        //calculate total price using credits and jobs
        companyNames.forEach((job) => {
            //compare job campany name with previous order company name if same then no credits change or else credits change
            if(userOrderData.length === 0){
                if(credits > 0){
                    credits--;
                }else{
                    totalPrice += 50
                }
            }else{
                if(!prevCompanyNames.includes(job)){
                    if(credits > 0){
                        credits--;
                    }else{
                        totalPrice += 50
                    }
                }
            }
        }
        );
        
        //calculate discount with creds used
        discount = (userData.acmMember - credits) * 50;
        //payment receipt

        if (!req.file) {
            return res.status(400).send({
              message: "Please upload the payment proof",
            });
          }

        const localPath = `resources/receipts/${req.file.filename}`;
        const uploadedReceipt = await cloudinaryUploadReceipt(localPath);
        const receipturl = uploadedReceipt.url;

        fs.unlink(localPath, (err) => {
            if (err) {
              console.log('Failed to delete local file:', err);
            } else {
              console.log('Local file deleted successfully.');
            }
          });
        //got jobs in cart, got the sumary, now create order
        
        let newOrder = await order.create({
            userId: userId,
            totalPrice: totalPrice,
            discount: discount,
            paymentMode: req.body.paymentMode,
            creditsUsed: userData.acmMember - credits,
            status: "paid",
            //paymentProof: "Medha Will do this"
            paymentProof : receipturl
        });

        //add jobs to order and remove from cart
        jobs.forEach(async (job) => {
            console.log(job);
            await newOrder.addJob(job);
            await userCart.removeJob(job);
        }
        );

        //update creds in user  
        await user.update({
            acmMember: credits
        },
        {
            where: {
                id: userId
            }
        }
        );

        newOrder = await order.findOne({
            where: {
                id: newOrder.id
            },
            include: [
                {
                    model: job
                }
            ]
        });

        return res.status(200).send({
            message: "Order created",
            data: newOrder
        });
    }catch(error){
        console.log(error);
        return res.send(500).send({
            message: error.message || "error."
        });
    }
};

exports.getHistory = async (req, res) => {
    try{
        const {userId} = req.body;
        const userOrders = await order.findAll({
            where: {
                userId: userId
            },
            include: [
                {
                    model: job
                }
            ]
        });
        if(!userOrders){
            return res.status(404).send({
                message: "No orders found."
            });
        }
        return res.status(200).send({
            message: "Orders found",
            data: userOrders
        });
    }catch(error){
        console.log(error);
        return res.send(500).send({
            message: error.message || "error."
        });
    }
};

exports.findOneOrder = async (req, res) => {
    try{
        const {orderId} = req.params;
        const orderData = await order.findOne({
            where: {
                id: orderId
            },
            include: [
                {
                    model: job
                }
            ]
        });
        if(!orderData){
            return res.status(404).send({
                message: "Order not found."
            });
        }
        return res.status(200).send({
            message: "Order found",
            data: orderData
        });
    }catch(error){
        console.log(error);
        return res.send(500).send({
            message: error.message || "error."
        });
    }
}

exports.viewHistory = async (req, res) => {
    try{
        const {userId} = req.params;
        const userOrders = await order.findAll({
            where: {
                userId: userId
            },
            include: [
                {
                    model: job
                }
            ]
        });
        if(!userOrders){
            return res.status(404).send({
                message: "No orders found."
            });
        }
        return res.status(200).send({
            message: "Orders found",
            data: userOrders
        });
    }catch(error){
        console.log(error);
        return res.send(500).send({
            message: error.message || "error."
        });
    }
};

exports.viewOrder = async (req, res) => {
    try{
        const {orderId} = req.params;
        const orderData = await order.findOne({
            where: {
                id: orderId
            },
            include: [
                {
                    model: job
                }
            ]
        });
        if(!orderData){
            return res.status(404).send({
                message: "Order not found."
            });
        }
        return res.status(200).send({
            message: "Order found",
            data: orderData
        });
    }catch(error){
        console.log(error);
        return res.send(500).send({
            message: error.message || "error."
        });
    }
}