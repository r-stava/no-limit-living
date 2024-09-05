const mongoose = require('mongoose');

const userInputSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    CostOfLiving: { type: Number, required: false },
    Violent: { type: Number, required: false },
    Homicide: { type: Number, required: false },
    Rape: { type: Number, required: false },
    Robbery: { type: Number, required: false },
    Assault: { type: Number, required: false }
});

const UserInput = mongoose.model('UserInput', userInputSchema);

module.exports = UserInput;
