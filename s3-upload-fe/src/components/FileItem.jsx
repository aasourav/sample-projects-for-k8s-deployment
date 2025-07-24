import React from 'react';

const FileItem = ({ file, onDelete }) => {
  return (
    <li>
      <a href={file.file_url} target="_blank" rel="noopener noreferrer">
        {file.file_url}
      </a>
      <button onClick={() => onDelete(file.id)}>Delete</button>
    </li>
  );
};

export default FileItem;

