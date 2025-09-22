// 1. Import the Express tool we just installed.
const express = require('express');

// 2. Create an instance of our server.
const app = express();

// 3. Define a "port" number for our server to listen on. 3000 is common.
const PORT = 3000;

// 4. Tell the server what to do when someone visits the main page ('/').
app.get('/', (req, res) => {
  res.send('HealthMe Backend Server is running!');
});

// 5. Start the server and make it listen for visitors on the port we defined.
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});