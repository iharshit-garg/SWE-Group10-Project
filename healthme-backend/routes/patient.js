const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/symptoms', authMiddleware, patientController.logSymptom);

module.exports = router;