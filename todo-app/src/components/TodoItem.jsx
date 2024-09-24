// src/components/TodoItem.js
import React from 'react';
import styled from 'styled-components';

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 15px;
  margin: 10px 0;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const TodoItem = ({ todo, onDone, onDelete }) => {
  return (
    <ItemContainer>
      <span style={{ textDecoration: todo.is_done ? 'line-through' : 'none' }}>
        {todo.title}
      </span>
      <div>
        {!todo.is_done && <Button onClick={() => onDone(todo.id)}>Done</Button>}
        <Button onClick={() => onDelete(todo.id)}>Delete</Button>
      </div>
    </ItemContainer>
  );
};

export default TodoItem;
