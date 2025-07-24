// src/components/TodoForm.js
import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #218838;
  }
`;

const TodoForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
        const response = await axios.post('/betodo/create', { title });
        console.log("HIHI",response.data) 
      onAdd(response.data);
      setTitle('');
    } catch (error) {
      console.error('Error creating TODO', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Enter TODO title"
      />
      <Button type="submit">Add TODO</Button>
    </Form>
  );
};

export default TodoForm;
