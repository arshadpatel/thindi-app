// Import required modules
const express = require('express');
const cors = require('cors');

// Create an instance of the Express app
const app = express();
const PORT = process.env.PORT || 5000; // Use port from environment or default to 5000

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse incoming JSON requests

// Simple route for testing
app.get('/status', (req, res) => {
    res.json({ message: 'API is running' }); // Send JSON response
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Log server status
});
