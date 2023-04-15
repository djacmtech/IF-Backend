const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const cloudinaryUploadPdf = async (fileToUpload) => {
    try{
        const data = await cloudinary.uploader.upload(fileToUpload, {
            resource_type: "auto",
            folder: "PDFs",
            use_filename: true,
            unique_filename: false,
        });
        return {
            url: data?.url,
        }
    }catch(error){
        console.log(error);
        return {
            url: null,
        }
    }
}

module.exports = {
    cloudinaryUploadPdf
}