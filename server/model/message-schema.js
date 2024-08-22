
import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';
import Chatroom from './chat-schema.js';
import User from './user-schema.js';

const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    messageType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    chatroomId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Chatroom,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  });
  
  Message.belongsTo(Chatroom, { foreignKey: 'chatroomId' });
  Message.belongsTo(User, { foreignKey: 'senderId' });
  
  export default Message;
