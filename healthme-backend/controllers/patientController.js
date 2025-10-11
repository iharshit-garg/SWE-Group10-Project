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