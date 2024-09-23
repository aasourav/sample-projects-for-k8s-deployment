import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const UploadForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
`;

const Input = styled.input`
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const UploadFile = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please choose a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/quickdrive/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('File upload failed.');
    }
  };

  return (
    <UploadForm onSubmit={handleSubmit}>
      <h2>Upload File</h2>
      <Input type="file" onChange={handleFileChange} />
      <Button type="submit">Upload</Button>
    </UploadForm>
  );
};

export default UploadFile;
