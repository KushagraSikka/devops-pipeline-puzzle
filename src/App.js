import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, Trophy, GitBranch, Box, Play, Server, X } from 'lucide-react';

const App = () => {
  const [time, setTime] = useState(120);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [draggingItem, setDraggingItem] = useState(null);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [solution, setSolution] = useState([]);
  const [feedback, setFeedback] = useState('');

  const componentIcons = {
    'Git Clone': GitBranch,
    'Build': Box,
    'Test': Play,
    'Deploy': Server,
    'Install Dependencies': Box,
    'Unit Tests': Play,
    'Integration Tests': Play,
    'Deploy to Staging': Server,
    'Deploy to Production': Server,
    'Linting': AlertCircle,
    'Security Scan': AlertCircle,
    'Docker Build': Box,
    'Push to Registry': Server
  };

  const levels = {
    1: {
      components: ['Git Clone', 'Build', 'Test', 'Deploy'],
      solution: ['Git Clone', 'Build', 'Test', 'Deploy'],
      description: 'Create a basic CI/CD pipeline',
    },
    2: {
      components: ['Git Clone', 'Install Dependencies', 'Build', 'Unit Tests', 'Integration Tests', 'Deploy to Staging', 'Deploy to Production'],
      solution: ['Git Clone', 'Install Dependencies', 'Build', 'Unit Tests', 'Integration Tests', 'Deploy to Staging', 'Deploy to Production'],
      description: 'Build a production deployment pipeline',
    },
    3: {
      components: ['Git Clone', 'Install Dependencies', 'Linting', 'Security Scan', 'Build', 'Unit Tests', 'Docker Build', 'Push to Registry', 'Deploy'],
      solution: ['Git Clone', 'Install Dependencies', 'Linting', 'Security Scan', 'Build', 'Unit Tests', 'Docker Build', 'Push to Registry', 'Deploy'],
      description: 'Create a secure containerized pipeline',
    }
  };

  useEffect(() => {
    if (time > 0 && !gameOver) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    } else if (time === 0) {
      setGameOver(true);
    }
  }, [time, gameOver]);

  const handleDragStart = (item, index = null) => {
    setDraggingItem(item);
    setDraggingIndex(index);
  };

  const handleDrop = (targetIndex) => {
    if (!draggingItem) return;

    const newSolution = [...solution];

    if (draggingIndex === null) {
      if (targetIndex === newSolution.length) {
        newSolution.push(draggingItem);
      } else {
        newSolution.splice(targetIndex, 0, draggingItem);
      }
    } else {
      const movedItem = newSolution[draggingIndex];
      newSolution.splice(draggingIndex, 1);
      if (targetIndex > draggingIndex) targetIndex--;
      newSolution.splice(targetIndex, 0, movedItem);
    }

    setSolution(newSolution);
    setDraggingItem(null);
    setDraggingIndex(null);
  };

  const removeItem = (index) => {
    const newSolution = [...solution];
    newSolution.splice(index, 1);
    setSolution(newSolution);
  };

  const checkSolution = () => {
    const currentSolution = levels[currentLevel].solution;
    if (solution.length !== currentSolution.length) {
      setFeedback('Pipeline incomplete! Add all required components.');
      return;
    }

    const isCorrect = solution.every((item, index) => item === currentSolution[index]);
    if (isCorrect) {
      const bonus = Math.floor(time / 10);
      setScore(score + 100 + bonus);
      if (currentLevel < Object.keys(levels).length) {
        setCurrentLevel(currentLevel + 1);
        setSolution([]);
        setFeedback('Great job! Moving to next level.');
      } else {
        setGameOver(true);
        setFeedback('Congratulations! You\'ve completed all levels!');
      }
    } else {
      setFeedback('Pipeline order incorrect! Try again.');
    }
  };

  const IconComponent = (name) => {
    const Icon = componentIcons[name];
    return Icon ? <Icon className="w-4 h-4 mr-2" /> : null;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Pipeline Puzzle - Level {currentLevel}</h1>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="p-6">
          {/* Timer and Score */}
          <div className="flex justify-between mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-lg font-semibold">
              <Clock className="mr-2 text-blue-500" />
              <span>{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</span>
            </div>
            <div className="flex items-center text-lg font-semibold">
              <Trophy className="mr-2 text-yellow-500" />
              <span>{score}</span>
            </div>
          </div>

          {/* Level Description */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center text-blue-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">{levels[currentLevel].description}</span>
            </div>
          </div>

          {/* Available Components */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Available Components</h3>
            <div className="flex flex-wrap gap-3">
              {levels[currentLevel].components.map((component, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(component)}
                  className="flex items-center bg-white border-2 border-blue-200 p-3 rounded-lg cursor-move hover:bg-blue-50 hover:border-blue-400 transition-all"
                >
                  {IconComponent(component)}
                  {component}
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Builder */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Your Pipeline</h3>
            <div className="flex flex-wrap gap-3 min-h-40 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
              {solution.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center group"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                >
                  <div
                    draggable
                    onDragStart={() => handleDragStart(item, index)}
                    className="flex items-center bg-green-100 border-2 border-green-200 p-3 rounded-lg cursor-move group-hover:bg-green-200 transition-colors relative"
                  >
                    {IconComponent(item)}
                    {item}
                    <button
                      onClick={() => removeItem(index)}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                  {index < solution.length - 1 && (
                    <div className="mx-2 text-blue-400">→</div>
                  )}
                </div>
              ))}
              <div
                className="h-16 w-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(solution.length)}
              >
                Drop here
              </div>
            </div>
          </div>

          {/* Check Button */}
          <button
            onClick={checkSolution}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={gameOver}
          >
            Check Pipeline
          </button>

          {/* Feedback Messages */}
          {feedback && (
            <div className={`mt-6 p-4 rounded-lg ${feedback.includes('Great') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {feedback}
            </div>
          )}

          {gameOver && (
            <div className="mt-6 bg-green-50 text-green-800 p-4 rounded-lg flex items-center">
              <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="font-semibold">Game Over! Final Score: {score}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;