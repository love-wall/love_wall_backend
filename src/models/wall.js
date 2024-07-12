const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Wall = sequelize.define('Wall', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    }
});

module.exports = Wall;
