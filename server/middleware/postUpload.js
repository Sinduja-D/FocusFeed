const multer = require('multer');
const path = require('path');
const fs = require('fs');

const imageDirectory = path.join(__dirname, '../uploads/images');
const videoDirectory = path.join(__dirname, '../uploads/videos');

fs.mkdirSync(imageDirectory, { recursive: true });
fs.mkdirSync(videoDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, file.fieldname === 'video' ? videoDirectory : imageDirectory);
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  }
});

const fileFilter = (req, file, callback) => {
  if (file.fieldname === 'image' && file.mimetype.startsWith('image/')) {
    return callback(null, true);
  }

  if (file.fieldname === 'video' && file.mimetype.startsWith('video/')) {
    return callback(null, true);
  }

  callback(new Error('Only image files can be uploaded as images and video files as videos.'));
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});
