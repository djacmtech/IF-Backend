const cloudinary = require('cloudinary');

const cloudinaryUploadPdf = async (fileToUpload) => {
    try{
        const uploadResponse = await cloudinary.uploader.upload(fileToUpload, {
            resource_type: 'raw',
        });
        return uploadResponse.url;
    }catch(error){
        console.log(error);
    }
}

module.exports = {
    cloudinaryUploadPdf
}