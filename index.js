

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../backend/model/User');
const Favorite = require('../backend/model/Favorite');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

mongoose.connect('mongodb+srv://a123:a123@cluster0.sdysttl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});

app.post('/user', async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone
    });

    await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, 'your-secret-key', { expiresIn: '1h' });

    res.status(201).json({ token, user: newUser });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Add movie to favorites endpoint
app.post('/favorites', async (req, res) => {
  try {
    const { userFrom, movieId, title, posterPath, movieRunTime, releaseDate, tagLine, overview } = req.body;

  
    const existingFavorite = await Favorite.findOne({ userFrom, movieId });
    if (existingFavorite) {
      return res.status(400).json({ error: 'Movie already in favorites' });
    }

    
    const newFavorite = new Favorite({ userFrom, movieId, title, posterPath, movieRunTime, releaseDate, tagLine, overview });
    await newFavorite.save();

    res.status(201).json({ message: 'Movie added to favorites' });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.delete('/favorites/:userId/:movieId', async (req, res) => {
  try {
    const { _id, movieId } = req.params;

    
    await Favorite.findOneAndDelete({ userFrom: _id, movieId: movieId });

    res.status(200).json({ message: 'Movie removed from favorites' });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});






app.get('/favorites/:userId', async (req, res) => {
  try {
    const userId = req.query.userFrom; 

    const favorites = await Favorite.find({ userFrom: userId });

    res.status(200).json({ favorites });
  } catch (error) {
    console.error('Fetch favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
