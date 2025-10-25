const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

const isPatient = checkRole('patient');

router.post('/symptoms', [authMiddleware, isPatient], patientController.logSymptom);
router.get('/symptoms', [authMiddleware, isPatient], patientController.getSymptomHistory);
router.post('/appointments', [authMiddleware, isPatient], patientController.scheduleAppointment);
router.post('/messages', [authMiddleware, isPatient], patientController.leaveMessage);

module.exports = router;