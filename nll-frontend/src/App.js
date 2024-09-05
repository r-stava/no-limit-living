import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        CostOfLiving: '',
        Violent: '',
        Homicide: '',
        Rape: '',
        Robbery: '',
        Assault: ''
    });

    const [prediction, setPrediction] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Send user data to the backend
            const userResponse = await axios.post('http://localhost:5000/api/user', formData);
            if (userResponse.status === 200) {
                const userId = userResponse.data._id;  // Backend returns user ID

                // Request prediction using the user ID
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
            <h1>No Limit Living User Form</h1>
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
                    <label>Violent Crime Rate:</label>
                    <input type="number" name="Violent" value={formData.Violent} onChange={handleChange} />
                </div>
                <div>
                    <label>Homicide Rate:</label>
                    <input type="number" name="Homicide" value={formData.Homicide} onChange={handleChange} />
                </div>
                <div>
                    <label>Rape Rate:</label>
                    <input type="number" name="Rape" value={formData.Rape} onChange={handleChange} />
                </div>
                <div>
                    <label>Robbery Rate:</label>
                    <input type="number" name="Robbery" value={formData.Robbery} onChange={handleChange} />
                </div>
                <div>
                    <label>Assault Rate:</label>
                    <input type="number" name="Assault" value={formData.Assault} onChange={handleChange} />
                </div>
                <button type="submit">Submit</button>
            </form>
            {loading && <p>Loading...</p>}
            {prediction && <p>Predicted State: {prediction}</p>}
        </div>
    );
}

export default App;
