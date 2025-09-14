import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration
cloudinary.config({
  cloud_name: 'dg199z67j',
  api_key: '282998588259849',
  api_secret: 'injSish5RoTdfteJqhuL7f1coek',
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    // File has been uploaded successfully
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log('Cloudinary upload error:', error);

    // Remove the locally saved temporary file if upload failed
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

// Function to extract public_id from Cloudinary URL
const extractPublicId = (url) => {
  if (!url) return null;

  // Cloudinary URL format analysis:
  // https://res.cloudinary.com/<cloud_name>/image/upload/<version>/<public_id>.<format>
  // Example: https://res.cloudinary.com/dg199z67j/image/upload/v1234567890/sample.jpg

  try {
    // Split URL by slashes
    const urlParts = url.split('/');

    // Find the index of 'upload' in the URL path
    const uploadIndex = urlParts.indexOf('upload');

    if (uploadIndex === -1 || uploadIndex >= urlParts.length - 1) {
      return null;
    }

    // The public_id is everything after 'upload' but we need to remove the version if present
    let publicIdWithExtension = urlParts.slice(uploadIndex + 1).join('/');

    // Remove version if present (starts with 'v' followed by numbers)
    if (publicIdWithExtension.startsWith('v')) {
      const firstSlashIndex = publicIdWithExtension.indexOf('/');
      if (firstSlashIndex !== -1) {
        publicIdWithExtension = publicIdWithExtension.substring(
          firstSlashIndex + 1
        );
      }
    }

    // Remove file extension
    const lastDotIndex = publicIdWithExtension.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      return publicIdWithExtension.substring(0, lastDotIndex);
    }

    return publicIdWithExtension;
  } catch (error) {
    console.error('Error extracting public_id from URL:', error);
    return null;
  }
};

// Function to delete image from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  try {
    const publicId = extractPublicId(imageUrl);

    if (!publicId) {
      console.warn('Could not extract public_id from URL:', imageUrl);
      return { result: 'not_found' };
    }

    console.log('Deleting from Cloudinary with public_id:', publicId);

    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary deletion result:', result);

    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary, extractPublicId };

// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';

// // cloudinary.config({
// //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET,
// // });

// cloudinary.config({
//   cloud_name: 'dg199z67j',
//   api_key: '282998588259849',
//   api_secret: 'injSish5RoTdfteJqhuL7f1coek',
// });

// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     //console.log('localFilePath', localFilePath);
//     if (!localFilePath) return null;
//     //upload the file on cloudinary
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: 'auto',
//     });
//     // file has been uploaded successfull
//     //console.log("file is uploaded on cloudinary ", response.url);
//     fs.unlinkSync(localFilePath);
//     // console.log('response', response);
//     return response;
//   } catch (error) {
//     console.log('error', error);
//     fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
//     return null;
//   }
// };

// export { uploadOnCloudinary };
