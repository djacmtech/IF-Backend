const db = require('../../models');
const jobdes = db.Jdes; //user table from db
//create 
exports.create = async (req, res) => {
    try{
        const Jdesc = await jobdes.create(req.body);     //create jdesc.model ka tuple and store in jobdes
        res.send(Jdesc);
    }catch(error){
        console.log(error);
    }
};
//find in db
exports.findAll = async (req, res) => {
    try{
        const Jdesc = await jobdes.findAll();
        res.send(Jdesc);
    }catch(error){
        console.log(error);
    }
}