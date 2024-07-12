const sequelize = require('../config/db');
const Wall = require('./wall');
const Image = require('./image');

Wall.hasMany(Image, { foreignKey: 'wallId' });
Image.belongsTo(Wall, { foreignKey: 'wallId' });

sequelize.sync({ force: false }) // `force: true` will drop the table if it already exists
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => {
        console.error('Unable to create database & tables:', err);
    });

module.exports = {
    sequelize,
    Wall,
    Image
};
