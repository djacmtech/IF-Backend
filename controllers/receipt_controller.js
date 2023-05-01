const db = require('../models');
const order = db.order;
const cart = db.cart;
const user = db.user;
const job = db.job;

exports.getReceipt = async (req, res) => {
    try{
        const { orderId } = req.params;
        console.log(orderId);
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
};