const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/quizapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Quiz Schema
const QuizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
  setName: String
});

const QuizSetSchema = new mongoose.Schema({
  name: String,
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }]
});

const Quiz = mongoose.model('Quiz', QuizSchema);
const QuizSet = mongoose.model('QuizSet', QuizSetSchema);

// Routes
app.get('/api/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/quizzes', async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    await newQuiz.save();
    res.json(newQuiz);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/quizzes/:setName', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ setName: req.params.setName });
    res.json(quizzes);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/quiz-sets', async (req, res) => {
  try {
    const newQuizSet = new QuizSet({ name: req.body.name });
    await newQuizSet.save();
    res.json(newQuizSet);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/quiz-sets', async (req, res) => {
  try {
    const quizSets = await QuizSet.find();
    res.json(quizSets);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/quiz-sets/:id', async (req, res) => {
  try {
    const quizSet = await QuizSet.findById(req.params.id).populate('quizzes');
    res.json(quizSet);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
