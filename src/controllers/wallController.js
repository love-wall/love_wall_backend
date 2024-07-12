const { Wall } = require('../models');

const createWall = async (req, res) => {
    console.log('req.body', req.body);
    try {
        const wall = await Wall.create(req.body);
        res.status(201).send(wall);
    } catch (error) {
        res.status(400).send(error);
    }
};

const getWall = async (req, res) => {
    try {
        const wall = await Wall.findByPk(req.params.id);
        if (!wall) {
            return res.status(404).send();
        }
        res.send(wall);
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    createWall,
    getWall
};
