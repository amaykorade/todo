import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import TodoApp from './features/TodoApp';


function App() {
  return (
    <div className="App">
      <TodoApp />
    </div>
  );
}

export default App;
