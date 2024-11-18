const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wasteManagement', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

// Create a new user
app.post('/api/users', async (req, res) => {
    const { username, qrCode } = req.body;
    try {
        const user = new User({ username, qrCode });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Could not create user' });
    }
});

// Add points to a user
app.post('/api/users/:username/add-points', async (req, res) => {
    const { username } = req.params;
    const { pointsToAdd } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.points += pointsToAdd;

        if (user.points >= 100 && !user.badges.includes('100 Points Badge')) {
            user.badges.push('100 Points Badge');
        }

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error updating points' });
    }
});

// Reset points for a user
app.post('/api/users/:username/reset-points', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.points = 0;
        user.badges = [];
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error resetting points' });
    }
});
