const Symptom = require('../models/Symptom');
const OpenAI = require('openai');
const Appointment = require('../models/Appointment');
const Message = require('../models/Message');
const User = require('../models/User');

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

exports.getAiAdvice = async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms || symptoms.length === 0) {
    return res.status(400).json({ message: 'No symptoms provided.' });
  }

  try {
    const prompt = `A user has the following symptoms: ${symptoms.join(', ')}. Based on these symptoms, what is a possible cause and what is some general health advice? Format the response as a JSON object with two keys: "cause" and "advice".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);

    res.json(aiResponse);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).send('Error getting AI advice.');
  }
};

exports.scheduleAppointment = async (req, res) => {
  const { doctorId, date, reason } = req.body;
  try {
    const newAppointment = new Appointment({
      patient: req.user.id,
      doctor: doctorId,
      date,
      reason
    });
    await newAppointment.save();
    res.status(201).json({ message: 'Appointment scheduled successfully.' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.leaveMessage = async (req, res) => {
  const { doctorId, content } = req.body;
  try {
    const newMessage = new Message({
      from: req.user.id,
      to: doctorId,
      content
    });
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully.' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};