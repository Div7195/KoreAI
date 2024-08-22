
import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';
import User from './user-schema.js';


const Chatroom = sequelize.define('Chatroom', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userOneId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    userTwoId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  });

  Chatroom.belongsTo(User, { as: 'userOne', foreignKey: 'userOneId' });
  Chatroom.belongsTo(User, { as: 'userTwo', foreignKey: 'userTwoId' });
  
  export default Chatroom;
