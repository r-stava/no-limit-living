const mongoose = require('mongoose');

const userInputSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    CostOfLiving: { type: Number, required: true },
    Violent: { type: Number, required: true },
    Homicide: { type: Number, required: true },
    Rape: { type: Number, required: true },
    Robbery: { type: Number, required: true },
    Assault: { type: Number, required: true }
});

const UserInput = mongoose.model('UserInput', userInputSchema);

module.exports = UserInput;
