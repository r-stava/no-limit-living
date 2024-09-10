const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const UserInput = require('../models/UserInput'); // Ensure this points to your UserInput model


function generateCrimeRates(lowCrimeRate) {
    if (lowCrimeRate) {
        return {
            Violent: Math.random() * (150 - 50) + 50, // Generate values between 50 and 150 for low crime
            Homicide: Math.random() * (5 - 1) + 1,
            Rape: Math.random() * (30 - 10) + 10,
            Robbery: Math.random() * (150 - 50) + 50,
            Assault: Math.random() * (200 - 100) + 100,
        };
    } else {
        return {
            Violent: Math.random() * (400 - 200) + 200, // Generate values between 200 and 400 for higher crime
            Homicide: Math.random() * (20 - 5) + 5,
            Rape: Math.random() * (60 - 30) + 30,
            Robbery: Math.random() * (300 - 150) + 150,
            Assault: Math.random() * (400 - 200) + 200,
        };
    }
}

// Route to handle user data submissions
router.post('/user', async (req, res) => {
    try {
        const { name, age, CostOfLiving, lowCrimeRate } = req.body;

        // Generate random crime values based on the lowCrimeRate flag
        const crimeRates = generateCrimeRates(lowCrimeRate);

        const newUser = new UserInput({
            name,
            age,
            CostOfLiving,
            ...crimeRates, // Spread the randomly generated crime values
        });

        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).send('Failed to save user data: ' + error.message);
    }
});

// Route to handle prediction requests 
router.post('/predict', async (req, res) => {
    try {
        // Retrieve user data by ID passed in the request body
        const userData = await UserInput.findById(req.body.userId);
        if (!userData) {
            return res.status(404).send('User not found');
        }

        // Prepare features for the prediction model
        const features = [
            userData.CostOfLiving,
            userData.Violent,
            userData.Homicide,
            userData.Rape,
            userData.Robbery,
            userData.Assault
        ];

        console.log('Features being passed to Python:', features);

        // Spawn the Python process for prediction, passing features as command line arguments
        const pythonProcess = spawn('python', ['C:/Users/PNW_checkout/no-limit-living/ml-model/predict.py', ...features.map(String)]);

        let result = '';

        // Collect data from the Python script
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();  // Concatenate data from the Python script to result
        });

        // Handle errors from the Python script
        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data.toString()}`);
            if (!res.headersSent) {
                res.status(500).send('Error in prediction script: ' + data.toString());
            }
        });

        pythonProcess.on('close', (code) => {
            if (!res.headersSent) {
                if (code !== 0) {
                    res.status(500).send('Prediction process failed with code ' + code);
                } else {
                    res.send(result.trim());  // Send the cleaned-up result back to the client
                }
            }
        });
    } catch (error) {
        console.error('Error in prediction route:', error);
        if (!res.headersSent) {
            res.status(500).send('Server error: ' + error.message);
        }
    }
});

module.exports = router;
