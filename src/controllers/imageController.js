const { Image } = require('../models');
const path = require('path');
const multer = require('multer');
const { Op } = require('sequelize');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage }).single('image');

// Upload image and insert into database
const uploadImage = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const { wallId, x, y } = req.body;
        const url = `/uploads/${req.file.filename}`;

        if (!wallId || !x || !y) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const image = await Image.create({ wallId, url, x, y });
            res.status(201).json(image);
        } catch (error) {
            console.error("Error inserting image into database:", error);
            res.status(500).json({ error: "Error inserting image into database" });
        }
    });
};

// Get images within the specified range and for the specified wallId
const getImages = async (req, res) => {
    const { minX, maxX, minY, maxY, wallId } = req.query;
    if (!minX || !maxX || !minY || !maxY || !wallId) {
        return res.status(400).json({ error: "Missing required query parameters" });
    }

    try {
        const images = await Image.findAll({
            where: {
                wallId,
                x: { [Op.between]: [minX, maxX] },
                y: { [Op.between]: [minY, maxY] }
            }
        });
        res.json(images);
    } catch (error) {
        console.error("Error fetching images from database:", error);
        res.status(500).json({ error: "Error fetching images from database" });
    }
};

// Update image position in the database
const updateImagePosition = async (req, res) => {
    const { id, x, y } = req.body;
    if (!id || x === undefined || y === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const image = await Image.findByPk(id);
        if (!image) {
            return res.status(404).json({ error: "Image not found" });
        }

        image.x = x;
        image.y = y;
        await image.save();
        res.json(image);
    } catch (error) {
        console.error("Error updating image position:", error);
        res.status(500).json({ error: "Error updating image position" });
    }
};

module.exports = { uploadImage, getImages, updateImagePosition };
