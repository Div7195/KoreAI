import multer from 'multer'
import {GridFsStorage} from 'multer-gridfs-storage'
import dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config()


const storage = new GridFsStorage({
    url: `mongodb://localhost:27017/chat-media`,
    file: (request, file) => {
      
      const match = ["image/jpeg", "image/png", "image/jpg, video/mp4"];
      if (match.indexOf(file.mimetype) === -1) {
        return `${Date.now()}-post-${file.originalname}`;
      }
      
      return {
        bucketName: "fs",
        filename: `${Date.now()}-post-${file.originalname}`,
        
      };
    
    },
  });
  
export default multer({ storage })