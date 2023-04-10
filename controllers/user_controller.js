const db = require('../../models');
const user = db.User; //user table from db
//create 
exports.create = async (req, res) => {
    try{
        const User = await user.create(req.body);     //create User.model ka tuple and store in User
        res.send(User);
    }catch(error){
        console.log(error);
    }
};
//find in db
exports.findAll = async (req, res) => {
    try{
        const users = await User.findAll();
        res.send(users);
    }catch(error){
        console.log(error);
    }
}