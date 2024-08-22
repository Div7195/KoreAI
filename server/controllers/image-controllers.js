import grid from 'gridfs-stream'
import mongoose, { mongo } from "mongoose";
import Chat from "../model/chat-schema.js";
const url = 'http://localhost:8000'
const mongoConnect = async () =>{
    const URL = `mongodb://localhost:27017/chat-media`

    try {
        await mongoose.connect(URL);
        console.log("Mongodb connected succesfully");
    } catch (error) {
        console.log("Error while connecting to database:", error);
    }
}
mongoConnect()
let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once('open',()=>{
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db,{
        bucketName: 'fs'
    });
    gfs= grid(conn.db, mongoose.mongo);
    gfs.collection('fs');

})

export const uploadImageController=(request , response)=>{
    try {
    if(!request.file){
        return response.status(404).json({msg: "File Not Found"})
    }

    const imageUrl = `${url}/file/${request.file.filename}`;

    return response.status(200).json(imageUrl);
} catch (error) {
    console.log(error)
    return
}
}
export const uploadChatImageController=async (request , response)=>{
    try {
        
    if(!request.file){
        return response.status(404).json({msg: "File Not Found"})
    }
    const imageUrl = `${url}/file/${request.file.filename}`;
    let messageType = imageUrl.toLowerCase().includes('mp4') === true?'video':'image'
    
        return response.status(200).json({mediaUrl:imageUrl, messageType:messageType})
    }
    catch (error) {
    console.log(error)
    return
}
}


export const getImageController = async(request , response) => {
    try {
        console.log(request.params)
        const file = await gfs.files.findOne({ filename: request.params.filename })
        console.log(file)
        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.pipe(response);

    } catch (error) {
        console.log(error)
        return response.status(500).json({ msg: error.message});
    }
}