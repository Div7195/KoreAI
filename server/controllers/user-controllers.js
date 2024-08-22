
import bcrypt from 'bcrypt';
import User from '../model/user-schema.js';
import Chatroom from '../model/chat-schema.js';
import sequelize from '../database/db.js';
import Message from '../model/message-schema.js';
import { Op } from 'sequelize';
import { QueryTypes } from 'sequelize';
export const signupUserController = async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({ username, password: hashedPassword });
    //   console.log(newUser.id)
      const existingUsers = await User.findAll({ where: { id: { [Op.ne]: newUser.id } } });
      const existingUserIds = existingUsers.map(user => user.id);
  
      const chatroomPromises = existingUserIds.map(userId => {
        return Chatroom.create({ userOneId: newUser.id, userTwoId: userId });
      });
  
      await Promise.all(chatroomPromises);
  
      res.status(201).json({ message: 'User created and chatrooms set up successfully' });
    } catch (error) {
    //   console.error('Error during user signup:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


  export const loginUserController = async (req, res) => {
    try {
      const user = await User.findOne({ where: { username: req.body.username } });
      
      if (!user) {
        return res.status(400).json({ msg: 'Username does not exist' });
      }
  
      const match = await bcrypt.compare(req.body.password, user.password);
      if (match) {
        console.log('here')
        // console.log(user.id)
        return res.status(200).json({ username: user.username, userId: user.id, msg: 'Login successful' });
      } else {
        return res.status(400).json({ msg: 'Password does not match' });
      }
    } catch (error) {
  
      return res.status(500).json({ msg: 'Error while logging in user', error });
    }
  };


  export const getChatRoomMessages = async (req, res) => {
    try {
        const { chatId, limit = 20, offset = 0 } = req.query;

        if (!chatId) {
          return res.status(400).json({ error: 'Chatroom ID is required' });
        }
    
        const messages = await Message.findAll({
          where: { chatroomId: chatId },
          include: [
            {
              model: Chatroom,
              as: 'Chatroom',
              attributes: ['id'] 
            }
          ],
          order: [['timestamp']], 
          limit: parseInt(limit),         
          offset: parseInt(offset)        
        });

        if (messages.length === 0) {
          return res.status(404).json({ error: 'No messages found for this chatroom' });
        }
    
        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Error fetching messages' });
    }
};


  export const getUserChatroomUsernames = async (req, res) => {
    try {
      const { userId } = req.query;
  
     
      const chatrooms = await Chatroom.findAll({
        where: {
          [Op.or]: [
            { userOneId: userId },
            { userTwoId: userId }
          ]
        },
        include: [
          {
            model: User,
            as: 'UserOne',
            attributes: ['username']
          },
          {
            model: User,
            as: 'UserTwo',
            attributes: ['username']
          }
        ]
      });
    //   console.log(chatrooms)
      
      const chatroomUsernames = chatrooms.map(chatroom => {
        const otherUserUsername = chatroom.userOneId === userId
          ? chatroom.UserTwo.username
          : chatroom.UserOne.username;
        return {
          chatroomId: chatroom.id,
          otherUserUsername
        };
      });
    //   console.log(chatroomUsernames)
      console.log(chatroomUsernames.length)
      res.status(200).json({ chatroomUsernames });
    } catch (error) {
    //   console.error('Error fetching chatroom usernames:', error);
      res.status(500).json({ error: 'Error fetching chatroom usernames.' });
    }
  };






