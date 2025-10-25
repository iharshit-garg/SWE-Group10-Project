const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.get('/patients', [authMiddleware, checkRole('doctor')], doctorController.getAllPatients);
router.get('/patients/:patientId/symptoms', [authMiddleware, checkRole('doctor')], doctorController.getPatientSymptomHistory);
module.exports = router;