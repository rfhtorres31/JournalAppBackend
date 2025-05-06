const {DataTypes} = require('sequelize');
const seqInstance = require('../config/Sequelize');



const User = seqInstance.define( 'user', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    
    encryptedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    },
    {
        tableName: 'user',
        timestamps: true,
   });


module.exports = User;