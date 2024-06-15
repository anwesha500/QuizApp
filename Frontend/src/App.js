import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({ question: '', options: ['', '', '', ''], answer: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/quizzes')
      .then(response => setQuizzes(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleChange = (e) => {
    setNewQuiz({ ...newQuiz, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const options = [...newQuiz.options];
    options[index] = value;
    setNewQuiz({ ...newQuiz, options });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newQuiz.options.includes(newQuiz.answer)) {
      setError('The answer must be one of the options');
      return;
    }
    axios.post('http://localhost:5000/api/quizzes', newQuiz)
      .then(response => {
        setQuizzes([...quizzes, response.data]);
        setNewQuiz({ question: '', options: ['', '', '', ''], answer: '' });
        setError('');
      })
      .catch(error => {
        console.error(error);
        setError('Failed to add quiz');
      });
  };

  return (
    <div className="container">
      <h1>Quiz App</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Question:</label>
          <input type="text" name="question" value={newQuiz.question} onChange={handleChange} required />
        </div>
        {newQuiz.options.map((option, index) => (
          <div key={index}>
            <label>Option {index + 1}:</label>
            <input type="text" value={option} onChange={(e) => handleOptionChange(index, e.target.value)} required />
          </div>
        ))}
        <div>
          <label>Answer:</label>
          <input type="text" name="answer" value={newQuiz.answer} onChange={handleChange} required />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Add Quiz</button>
      </form>
      {quizzes.map(quiz => (
        <div className="quiz-container" key={quiz._id}>
          <h2>{quiz.question}</h2>
          <div className="options-container"> {/* Added a wrapping div */}
            <ul>
              {quiz.options.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
          </div>
          <p>Answer: {quiz.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default App;