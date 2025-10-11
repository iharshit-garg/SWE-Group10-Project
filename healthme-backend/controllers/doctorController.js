const User = require('../models/User');
const Symptom = require('../models/Symptom');

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.json(patients);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getPatientSymptomHistory = async (req, res) => {
    try {
        const history = await Symptom.find({ patient: req.params.patientId }).sort({ date: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};