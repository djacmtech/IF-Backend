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
        
        //calculate total price using credits and jobs
        jobs.forEach((job) => {
            if(credits > 0){
                credits--;
            }else{
                totalPrice += 50
            }
        }
        );
        
        //calculate discount with creds used
        discount = (userData.acmMember - credits) * 50;

        //return summary
        return res.status(200).send({
            message: "Summary calculated",
            data: {
                jobs,
                credits,
                totalPrice,
                discount
            }
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            message: error.message || "error.",
        });
    }
};