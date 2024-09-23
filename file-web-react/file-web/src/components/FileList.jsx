import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const PageContainer = styled.div`
  font-family: 'Arial', sans-serif;
  background-color: #f7f9fc;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  width: 100dvw;

   /* Background Image */
  background-image: url('/bg.png'); /* Change this to your image path */
  background-size: cover; /* Ensures the image covers the whole container */
  background-position: center; /* Centers the image */
  background-repeat: no-repeat; /* Prevents the image from repeating */
`;

const Header = styled.header`
//   background-color: #4e73df;
  width: 100%;
  padding: 15px 0;
  text-align: center;
  color: white;
  font-size: 2em;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const UploadForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
`;

const UploadInput = styled.input`
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const UploadButton = styled.button`
  padding: 10px 20px;
  background-color: #1cc88a;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #17a673;
  }
`;

const FileListContainer = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const FileRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #e3e6f0;

  &:last-child {
    border-bottom: none;
  }
`;

const FileName = styled.span`
  font-size: 16px;
  color: #4e73df;
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
`;

const DownloadButton = styled.button`
  padding: 8px 15px;
  background-color: #36b9cc;
  color: white;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: #2c9faf;
  }
`;

const DeleteButton = styled.button`
  padding: 8px 15px;
  background-color: #e74a3b;
  color: white;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #d73933;
  }
`;

const Title = styled.h2`
  font-size: 1.5em;
  color: #4e73df;
  margin-bottom: 20px;
`;

const Img = styled.img`
    width: 40px;
    height: 30px;
`

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('/quickdrive/files');
        setFiles(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFiles();
  }, []);

  const handleDownload = (id) => {
    window.location.href = `/quickdrive/download/${id}`;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await axios.delete(`/quickdrive/files/${id}`);
        alert('File deleted successfully!');
        setFiles(files.filter(file => file.id !== id)); // Update file list after deletion
      } catch (err) {
        console.error(err);
        alert('Failed to delete the file.');
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post('/quickdrive/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully!');
      window.location.reload(); // Refresh to show the new file
    } catch (err) {
      console.error(err);
      alert('Failed to upload the file.');
    }
  };

  return (
    <PageContainer>
      <Header><Img src='/logo.png'/>QuickDrive(Django)</Header>

      <UploadForm onSubmit={handleUpload}>
        {/* <Title>Upload a File</Title> */}
        <UploadInput 
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <UploadButton type="submit">Upload File</UploadButton>
      </UploadForm>

      <FileListContainer>
        <Title>Uploaded Files</Title>
        {files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          files.map((file) => (
            <FileRow key={file.id}>
              <FileName>{file.name}</FileName>
              <ButtonGroup>
                <DownloadButton onClick={() => handleDownload(file.id)}>Download</DownloadButton>
                <DeleteButton onClick={() => handleDelete(file.id)}>Delete</DeleteButton>
              </ButtonGroup>
            </FileRow>
          ))
        )}
      </FileListContainer>
    </PageContainer>
  );
};

export default FileList;
