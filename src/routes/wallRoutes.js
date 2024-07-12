const express = require('express');
const { createWall, getWall } = require('../controllers/wallController');
const router = express.Router();

router.post('/walls', createWall);
router.get('/walls/:id', getWall);

module.exports = router;
