const express = require('express');
const { uploadImage, getImages, updateImagePosition } = require('../controllers/imageController');
const router = express.Router();

router.post('/images', uploadImage);
router.get('/images', getImages);
router.put('/images/position', updateImagePosition);

module.exports = router;
