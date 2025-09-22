// 1. Import the Express tool we just installed.
const express = require('express');
const mongoose = require('mongoose');

// 2. Create an instance of our server.
const app = express();

// 3. Define a "port" number for our server to listen on. 3000 is common.
const PORT = 3000;
const MONGO_URI = "mongodb+srv://qle17_db_user:rYy1jSEhNaG0ENsx@cluster0.attdos5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGO_URI)
    .then( () => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log('MongoDB connection error');
    });
// 4. Tell the server what to do when someone visits the main page ('/').
app.get('/', (req, res) => {
  res.send('HealthMe Backend Server is running!');
});

// 5. Start the server and make it listen for visitors on the port we defined.
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});