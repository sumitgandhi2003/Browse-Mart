import { v2 as cloudinary } from "cloudinary";
import { CloudinaryImage, CloudinaryConfig } from "@cloudinary/url-gen/index";
const API_KEY = process.env.REACT_APP_CLOUDINARY_API_KEY;
const API_SECRET = process.env.REACT.APP_CLOUDINARY_API_SECRET;
const CLOUD_NAME = process.env.REACT.APP_CLOUDINARY_CLOUD_NAME;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

export default cloudinary;
