const db = require('../../models');
const order = db.order;
const cart = db.cart;
const user = db.user;

exports.getSummary = async (req, res) => {
    try{
        const {userId} = req.body;
        const userData = await user.findOne({
            where: {
                id: userId
            }
        });
        const cartData = await cart.findAll({
            where: {
                userId: userId
            }
        });
        
    }catch(error){
        console.log(error);
        return res.send(500).send({
            message: error.message || "error."
        });
    }
};