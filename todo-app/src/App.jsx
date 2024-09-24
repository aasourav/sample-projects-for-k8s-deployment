// src/App.js
import React from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import GlobalStyles from './styles/GlobalStyles';

const App = () => {
  return (
    <div>
      <GlobalStyles />
      <h1>TODO List</h1>
      <TodoForm onAdd={(newTodo) => console.log(newTodo)} />
      <TodoList />
    </div>
  );
};

export default App;
