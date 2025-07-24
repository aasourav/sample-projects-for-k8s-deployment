// src/components/TodoList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/betodo/list');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching TODOs', error);
    }
  };

  const handleDone = async (id) => {
    try {
      await axios.put(`/betodo/done/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error marking TODO as done', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/betodo/delete/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting TODO', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={{width:"100dvw", height:"100dvh",display:"flex", flexFlow:"column", alignItems:"center"}}>
        <div style={{width:"50%", alignItems:"center"}} >
      {todos.map((todo) => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          onDone={handleDone} 
          onDelete={handleDelete} 
        />
      ))}
        </div>
    </div>
  );
};

export default TodoList;
