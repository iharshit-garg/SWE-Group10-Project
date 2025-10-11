const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');

const isDoctor = (req, res, next) => {
    if (req.user && req.user.role === 'doctor') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Doctors only.' });
    }
};

router.get('/patients', [authMiddleware, isDoctor], doctorController.getAllPatients);
router.get('/patients/:patientId/symptoms', [authMiddleware, isDoctor], doctorController.getPatientSymptomHistory);

module.exports = router;