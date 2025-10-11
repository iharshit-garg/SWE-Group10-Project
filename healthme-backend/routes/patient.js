const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/symptoms', authMiddleware, patientController.logSymptom);
router.get('/symptoms', authMiddleware, patientController.getSymptomHistory);
router.post('/appointments', authMiddleware, patientController.scheduleAppointment);
router.post('/messages', authMiddleware, patientController.leaveMessage);

module.exports = router;