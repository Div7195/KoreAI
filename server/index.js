import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import Router from './routes/route.js';
import sequelize from './database/db.js';

import Message from './model/message-schema.js';
import User from './model/user-schema.js';
import Chatroom from './model/chat-schema.js';
dotenv.config();

const app = express();
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', Router);

const PORT = process.env.PORT || 8000;

User.belongsToMany(User, { 
    through: Chatroom, 
    as: 'Chatrooms', 
    foreignKey: 'userOneId', 
    otherKey: 'userTwoId' 
  });
  
  Chatroom.belongsTo(User, { as: 'UserOne', foreignKey: 'userOneId' });
  Chatroom.belongsTo(User, { as: 'UserTwo', foreignKey: 'userTwoId' });
  
  Chatroom.hasMany(Message, { foreignKey: 'chatroomId' });
  Message.belongsTo(Chatroom, { foreignKey: 'chatroomId' });
  Message.belongsTo(User, { foreignKey: 'senderId' });
  
sequelize.sync({ alter: true })


  .then(() => {
    console.log('Database synced');

    const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    
    const io = new Server(server, {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
      },
    });

    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);
      
      socket.on('joinroom', (obj) => {
        
        socket.join(obj.chatId);
        const room = io.sockets.adapter.rooms.get(obj.chatId);
        const numUsersInRoom = room ? room.size : 0;
        const message = {userId:obj.userId, status:'online'}
        console.log(numUsersInRoom + ' total users in this room')
        if(numUsersInRoom > 1){
           io.to(obj.chatId).emit('userCameOnline', message);
        }
       
        console.log(`User joined chatroom: ${obj.chatId}`);
      });
    
      socket.on('sendMessage', async ({ chatroomId, senderId, messageType, content }) => {
        try {
          const message = await Message.create({ chatroomId, senderId, messageType, content });
          console.log(content)
          io.to(chatroomId).emit('message', message);
        } catch (error) {
          console.error('Error sending message:', error);
        }
      });
      socket.on('typing', async ({ chatroomId, senderId}) => {
        try {
          const message = {
            userTypingId:senderId,
            message:'typing...'
          }
          io.to(chatroomId).emit('otherTyping', message);
        } catch (error) {
          console.error('Error sending message:', error);
        }
      });
    
      socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
      });
    });

  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });
