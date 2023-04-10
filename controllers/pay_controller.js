const db = require('../../models');
const pay = db.payment;

exports.create = async (req, res) => {
    try{
        const Payments = await pay.create(req.body);     //create jdesc.model ka tuple and store in jobdes
        res.send(Payments);
    }catch(error){
        console.log(error);
    }
};
//find in db
exports.findAll = async (req, res) => {
    try{
        const pays = await pay.findAll();
        res.send(pays);
    }catch(error){
        console.log(error);
    }
}