const db = require('../../models');
const cart = db.cart;

exports.addTocart = async (req, res) => {
    try{
        const cartData = {
            jobId : req.body.id,
            userId :req.body.userId
        }
        const Cart = await cart.findAll({
            where: {
              userId: req.body.userId,
            },
          });
        if(Cart){
            //add jobs into array
            //include query idhr
        }
        else{
            await cart.create({
                userId : req.body.userId,
                jobs : req.body.jobId

            })
            
        }
    }catch(error){
        console.log(err);
        return res.status(500).send({
            message: err.message || "error.",
        });
      }
};
//find in db
