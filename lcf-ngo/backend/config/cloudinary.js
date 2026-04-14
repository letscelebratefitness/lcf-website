const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === 'application/pdf';

    return {
      folder: 'lcf-ngo',
      resource_type: 'auto',
      allowed_formats:isPdf? ['pdf'] : ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: isPdf
        ? undefined
        : [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto' }]
    };
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(new Error('Only JPG, JPEG, PNG, WEBP, GIF, and PDF files are allowed'));
  }
});

module.exports = { cloudinary, upload };
