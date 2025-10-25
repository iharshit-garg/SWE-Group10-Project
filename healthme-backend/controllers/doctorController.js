const User = require('../models/User');
const Symptom = require('../models/Symptom');
const Appointment = require('../models/Appointment');

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

exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate('patient', 'email role')
      .sort({ date: 'asc' });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};