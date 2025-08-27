const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "plants", // Carpeta donde se guardarán las imágenes
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const parser = multer({ storage });

module.exports = parser;
