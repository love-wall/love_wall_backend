const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Image = sequelize.define('Image', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    wallId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    x: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    y: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
});

module.exports = Image;
