const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const {email, password, role} = req.body;
        // Check if user already exists
        let user = await User.findOne({email});
        if (user) {
            return res.status(404).json({message: `User already exists`});
        }
        // Create new user instance w/ model
        user = new User({email, password, role});
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        // Save user to database
        await user.save();
        res.status(201).json({ message: `Registered successfuly`});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};