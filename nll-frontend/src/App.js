import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        CostOfLiving: '',
        lowCrimeRate: false, // New field for the checkbox
    });

    const [prediction, setPrediction] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userResponse = await axios.post('http://localhost:5000/api/user', formData);
            if (userResponse.status === 200) {
                const userId = userResponse.data._id;
                const predictionResponse = await axios.post('http://localhost:5000/api/predict', { userId });
                setPrediction(predictionResponse.data);
                alert(`Prediction: ${predictionResponse.data}`);
            } else {
                alert('Failed to submit user data.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit user data or get prediction. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="App">
            <h1> No Limit Living User Information Form</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Age:</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} required />
                </div>
                <div>
                    <label>Cost of Living:</label>
                    <input type="number" name="CostOfLiving" value={formData.CostOfLiving} onChange={handleChange} />
                </div>
                <div>
                    <label>Low Crime Rate:</label>
                    <input type="checkbox" name="lowCrimeRate" checked={formData.lowCrimeRate} onChange={handleChange} />
                </div>
                <button type="submit">Submit</button>
            </form>
            {loading && <p>Loading...</p>}
            {prediction && <p>Predicted State: {prediction}</p>}
        </div>
    );
}

export default App;
