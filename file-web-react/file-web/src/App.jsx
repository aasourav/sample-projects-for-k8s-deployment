import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import styled from 'styled-components';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled(Link)`
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  text-decoration: none;
  color: white;
  background-color: #007bff;
  border-radius: 5px;
  
  &:hover {
    background-color: #0056b3;
  }
`;

function App() {
  return (
    <Router>
      <Container>
        {/* <Tabs>
          <Tab to="/">Upload File</Tab>
          <Tab to="/files">File List</Tab>
        </Tabs> */}

        <Routes>
          <Route path="/" element={<FileList />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
