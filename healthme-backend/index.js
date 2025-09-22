// 1. Import the Express tool we just installed.
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const app = express();
const PORT = 3000;
const MONGO_URI = "mongodb+srv://qle17_db_user:rYy1jSEhNaG0ENsx@cluster0.attdos5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then( () => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log('MongoDB connection error');
    });
app.use(express.json());
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('HealthMe Backend Server is running!');
});
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});