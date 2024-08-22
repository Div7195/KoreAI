import express from "express";
import { loginUserController, signupUserController } from "../controllers/user-controllers.js";
import { getUserChatroomUsernames } from "../controllers/user-controllers.js";
import { getChatRoomMessages } from "../controllers/user-controllers.js";
import upload from "../middleware/upload.js";
import { getImageController, uploadChatImageController } from "../controllers/image-controllers.js";
const Router = express.Router();

Router.post('/signup',signupUserController);
Router.post('/login',loginUserController);
Router.get('/getChatsUsernames',getUserChatroomUsernames);
Router.get('/getChatMessages',getChatRoomMessages);
Router.post('/uploadImageMessage', upload.single('file'), uploadChatImageController);
Router.get('/file/:filename',getImageController);
export default Router