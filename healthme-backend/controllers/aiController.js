const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const { OpenAIError } = require('openai/error');

// Analyze symptoms using AI
exports.analyzeSymptoms = async (req, res) => {
  const { symptoms } = req.body;
  if (!symptoms) {
    return res.status(400).json({ message: 'Symptoms are required.' });
  }

  const prompt = `Analyze these symptoms and suggest possible causes: "${symptoms}". Provide a general analysis and potential next steps. IMPORTANT: Include a disclaimer that this is not a medical diagnosis and the user should consult a healthcare professional.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({ analysis: completion.choices[0].message.content });
  } catch (error) {
    console.error('AI analysis error:', error);
    if (error instanceof OpenAIError) {
      // Forward specific OpenAI error messages if available
      return res.status(error.status || 500).json({ message: error.message || 'Failed to get analysis from AI service.' });
    }
    res.status(500).json({ message: 'Failed to analyze symptoms due to a server error.' });
  }
};
