const db = require("../models");
const cart = db.cart;
const job = db.job;
const user = db.user;
const order = db.order;

exports.calculateSummary = async (req, res) => {
    try{
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

        if(!cartData){
            return res.status(404).send({
                message: "Cart not found"
            });
        }
        let userData = await user.findByPk(userId);
        if(!userData){
            return res.status(404).send({
                message: "User not found"
            });
        }

        //take acmMember value from user
        let credits = parseInt(userData.acmMember);
        //take jobs from cart
        let jobs = cartData.jobs;
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

        //return summary
        return res.status(200).send({
            message: "Summary calculated",
            data: {
                credits,
                totalPrice,
                discount,
                cartId: cartData.id,
                jobs,
            }
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            message: error.message || "error.",
        });
    }
};

exports.viewSummary = async (req, res) => {
    try{
        const { userId } = req.params;
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

        if(!cartData){
            return res.status(404).send({
                message: "Cart not found"
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
        let jobs = cartData.jobs;
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

        //return summary
        return res.status(200).send({
            message: "Summary calculated",
            data: {
                credits,
                totalPrice,
                discount,
                cartId: cartData.id,
                jobs,
            }
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            message: error.message || "error.",
        });
    }
};