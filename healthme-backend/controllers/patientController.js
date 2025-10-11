const Symptom = require('../models/Symptom');

exports.logSymptom = async (req, res) => {
  try {
    const { symptoms } = req.body; 

    const newSymptomLog = new Symptom({
      symptoms,
      patient: req.user.id
    });

    await newSymptomLog.save();

    res.status(201).json({ message: 'Symptoms logged successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getSymptomHistory = async (req, res) => {
  try {
    // Find all symptom logs for the logged-in patient and sort by date
    const history = await Symptom.find({ patient: req.user.id }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};