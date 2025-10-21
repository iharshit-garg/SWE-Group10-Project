const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Analyze symptoms using AI
exports.analyzeSymptoms = async (req, res) => {
  const { symptoms } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Analyze these symptoms and suggest possible causes: ${symptoms}` }],
    });
    res.json({ analysis: completion.choices[0].message.content });
  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ message: 'Failed to analyze symptoms' });
  }
};
