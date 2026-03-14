const express = require('express');
const router = express.Router();
const { getDonors, getDonorById, getDonorStats } = require('../controllers/donorController');
router.get('/', getDonors);
router.get('/stats/overview', getDonorStats);
router.get('/:id', getDonorById);
module.exports = router;
