const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

const isPatient = checkRole('patient');

router.post('/symptoms', [authMiddleware, isPatient], patientController.logSymptom);
router.get('/symptoms', [authMiddleware, isPatient], patientController.getSymptomHistory);

router.post('/appointments', [authMiddleware, isPatient], patientController.scheduleAppointment);
router.get('/appointments', [authMiddleware, isPatient], patientController.getPatientAppointments);

router.post('/messages', [authMiddleware, isPatient], patientController.sendMessage);
router.get('/messages', [authMiddleware, isPatient], patientController.getPatientMessages);

router.get('/doctors', [authMiddleware, isPatient], doctorController.getAllDoctors);
module.exports = router;