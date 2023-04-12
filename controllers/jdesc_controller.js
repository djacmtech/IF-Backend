const db = require('../../models');
const jobdes = db.Jdes; //user table from db

const cloudinary = require("../middleware/upload.image.js");

//pls check krlena....tera hi code hai..bas changes karre hai
exports.create = async (req, res) => {
    try{
        const jobDesc = new formidable.IncomingForm();
        jobDesc.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: "Image could not be uploaded"
                });
            }
            if(!(Object.keys(files).length > 0)){
                return res.status(400).json({
                    error: "Image is required"
                });
            }
            const {role,company,logo,location,mode,stipend,duration,about,description,link,requirements,skills,perks} = fields;
            console.log('file', files.image.filepath);

            cloudinary.uploader.upload(files.image.filepath, (err, result) => {     
                console.log(result);
                jobdes.create({
                    image: result.secure_url,
                    role : role,
                    company:company,
                    logo:logo,
                    location:location,
                    mode:mode,
                    stipend:stipend,
                    duration:duration,
                    about:about,
                    description:description,
                    link:link,
                    requirements:requirements,
                    skills:skills,
                    perks:perks
                }). 
                then(data => {
                    res.status(200).send({
                        message: "Data added successfully"
                    });
                }).
                catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occured while updating the data."
                    });
                });
            });
        });
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