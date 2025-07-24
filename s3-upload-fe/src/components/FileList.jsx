import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FileItem from './FileItem';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('/sbe/files');
        setFiles(response.data);
      } catch (error) {
        setMessage('Error fetching files: ' + error.message);
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`/sbe/file/${fileId}`);
      setFiles(files.filter(file => file.id !== fileId));
      setMessage('File deleted successfully');
    } catch (error) {
      setMessage('Error deleting file: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Uploaded Files</h2>
      {message && <p>{message}</p>}
      <ul>
        {files.length > 0 ? (
          files.map((file) => (
            <FileItem key={file.id} file={file} onDelete={handleDelete} />
          ))
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </ul>
    </div>
  );
};

export default FileList;

