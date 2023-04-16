const db = require("../models");
const cart = db.cart;
const job = db.job;
const user = db.user;

exports.calculateSummary = async (req, res) => {
    try{
        const { userId, cartId } = req.body;
        //find cart in db and then include jobs from jobs table in cartData
        let cartData = await cart.findOne({
            where: {
                id: cartId,
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
        //if jobs is empty then return
        if(jobs.length === 0){
            return res.status(200).send({
                message: "No jobs in cart",
                data: {
                    credits,
                    jobs,
                }
            });
        }
        //if jobs is more than creds then return total credits and jobbs where each job has 50 value but  and update user credits to 0 and send updated credits
        if(jobs.length > credits){
            jobs.forEach((job) => {
                if(credits > 0){
                    credits = credits - 1;
                    totalPrice = totalPrice + 0;
                    discount = discount + 50;
                }else{
                    totalPrice = totalPrice + 50;
                }
            }
            );
            await user.update({
                acmMember: 0,
            },{
                where: {
                    id: userId,
                }
            });
            return res.status(200).send({
                message: "Jobs are more than credits",
                data: {
                    credits,
                    jobs,
                    totalPrice,
                    discount,
                }
            });
        }else if(jobs.length === credits){
            jobs.forEach((job) => {
                credits = credits - 1;
                totalPrice = totalPrice + 0;
                discount = discount + 50;
            }
            );
            await user.update({
                acmMember: 0,
            },{
                where: {
                    id: userId,
                }
            });
            return res.status(200).send({
                message: "Jobs are equal to credits",
                data: {
                    credits,
                    jobs,
                    totalPrice,
                    discount,
                }
            });
        }else{
            jobs.forEach((job) => {
                credits = credits - 1;
                totalPrice = totalPrice + 0;
                discount = discount + 50;
            }
            );
            await user.update({
                acmMember: credits,
            },{
                where: {
                    id: userId,
                }
            });
            return res.status(200).send({
                message: "Jobs are less than credits",
                data: {
                    credits,
                    jobs,
                    totalPrice,
                    discount,
                }
            });
        }
    }catch(error){
        console.log(error);
        return res.status(500).send({
            message: error.message || "error.",
        });
    }
};