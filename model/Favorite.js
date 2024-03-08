// Import Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Favorite model
const favoriteSchema = new mongoose.Schema({
  userFrom:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  movieId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  posterPath: {
    type: String,
    required: true
  },
  movieRunTime: {
    type: String,
    required: true
  },
  releaseDate: {
    type: String, 
    required: true
  },
  tagLine: {
    type: String,
    required: false
  },
  overview: {
    type: String,
    required: true
  }
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
