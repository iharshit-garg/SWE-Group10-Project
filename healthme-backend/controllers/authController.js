const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const {email, password, role} = req.body;
        if (!email || !password) {
          return res.status(400).json({ message: 'Please provide an email and password.' });
        }
        if (password.length < 6) {
          return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({message: `User already exists`});
        }
        user = new User({email, password, role});
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.status(201).json({ message: `Registered successfuly`});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }
  );

  res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};