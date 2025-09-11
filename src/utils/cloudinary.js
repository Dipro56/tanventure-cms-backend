import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({
  cloud_name: 'dg199z67j',
  api_key: '282998588259849',
  api_secret: 'injSish5RoTdfteJqhuL7f1coek',
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    //console.log('localFilePath', localFilePath);
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    // console.log('response', response);
    return response;
  } catch (error) {
    console.log('error', error);
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

export { uploadOnCloudinary };
