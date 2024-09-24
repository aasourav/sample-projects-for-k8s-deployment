const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const db = require('./db');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 9090;

app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST','DELETE'],
    credentials: true
}));

// Middleware to serve static files
app.use('/uploads', express.static('uploads'));

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// Create the uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Upload file and save file name to the database
app.post('/upload', upload.single('file'), (req, res) => {
    const fileName = req.file.originalname;
    console.log("FIle name: ",fileName)
    const sql = 'INSERT INTO files (name) VALUES (?)';
    db.query(sql, [fileName], (err, result) => {
        if (err) throw err;
        return res.status(200).json({ message: 'File uploaded successfully', fileName });
    });
});

// Get list of files
app.get('/files', (req, res) => {
    const sql = 'SELECT * FROM files';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.status(200).json(results);
    });
});

// delete file
app.delete('/files/:id', (req, res) => {
    const fileId = req.params.id;
  
    // First, get the file name from the database
    const getFileQuery = 'SELECT name FROM files WHERE id = ?';
    db.query(getFileQuery, [fileId], (err, results) => {
      if (err) throw err;
  
      if (results.length === 0) {
        return res.status(404).send('File not found.');
      }
  
      const fileName = results[0].name;
  
      // Delete file from disk
      const filePath = path.join(__dirname, 'uploads', fileName);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Failed to delete file from disk.');
        }
  
        // Delete file from database
        const deleteFileQuery = 'DELETE FROM files WHERE id = ?';
        db.query(deleteFileQuery, [fileId], (err, result) => {
          if (err) throw err;
          res.send('File deleted successfully.');
        });
      });
    });
  });

// Download a file
app.get('/download/:id', (req, res) => {
    const fileId = req.params.id;
    const sql = "SELECT name FROM files WHERE id = ?";
    
    db.query(sql, [fileId], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(404).send('File not found.');
        }

        const fileName = result[0].name;
        const filePath = path.join(__dirname, 'uploads', fileName);

        // Send the file as a response for download
        res.download(filePath, (err) => {
            if (err) {
                return res.status(500).send('Error occurred while downloading the file.');
            }
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
