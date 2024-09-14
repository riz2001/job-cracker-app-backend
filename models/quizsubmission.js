// Example schema for MongoDB using Mongoose
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  week: String,
 
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('quizSubmission', quizsubmissionSchema);
