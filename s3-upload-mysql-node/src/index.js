require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const cors = require('cors')
const path = require('path');
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

// Setup Express
const app = express();
app.use(cors());
const port = 3000;

// Setup Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Setup AWS S3 Client using SDK v3
const s3Client = new S3Client({
  region: process.env.AWS_REGION_1,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_1,
    secretAccessKey: process.env.AWS_SECRET_KEY_1,
  },
});

// Setup MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('error connecting to the database:', err.stack);
    return;
  }
  console.log('connected to MySQL database');
  createDatabaseAndTable();
});

// Function to create the database and table if they don't exist
const createDatabaseAndTable = () => {
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`;

  db.query(createDatabaseQuery, (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database created or already exists.');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS files (
        id INT AUTO_INCREMENT PRIMARY KEY,
        file_url VARCHAR(255) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    db.query(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Table "files" created or already exists.');
      }
    });
  });
};

// Route for uploading file
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileName = Date.now() + path.extname(req.file.originalname);

  const params = {
    Bucket: process.env.S3_BUCKET_NAME_1,
    Key: fileName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  try {
    // Upload file to S3 using PutObjectCommand (AWS SDK v3)
    const data = await s3Client.send(new PutObjectCommand(params));
    const fileUrl = `https://${process.env.S3_BUCKET_NAME_1}.s3.${process.env.AWS_REGION_1}.amazonaws.com/${fileName}`;

    // Store the file URL in MySQL
    const query = 'INSERT INTO files (file_url) VALUES (?)';
    db.query(query, [fileUrl], (err, result) => {
      if (err) {
        console.error('Error saving to MySQL:', err);
        return res.status(500).send('Error saving URL to database.');
      }

      res.status(200).send(`File uploaded successfully: ${fileUrl}`);
    });
  } catch (error) {
    console.error('Error uploading to S3:', error);
    res.status(500).send('Error uploading file.');
  }
});

// Route to list all files in MySQL database
app.get('/files', (req, res) => {
  const query = 'SELECT * FROM files';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error retrieving files:', err);
      return res.status(500).send('Error retrieving files from database.');
    }

    res.status(200).json(result);
  });
});

// Route to delete a file from MySQL and S3
app.delete('/file/:id', async (req, res) => {
  const fileId = req.params.id;

  // Fetch the file URL from MySQL to get the file name
  const query = 'SELECT * FROM files WHERE id = ?';
  db.query(query, [fileId], async (err, result) => {
    if (err) {
      console.error('Error retrieving file from database:', err);
      return res.status(500).send('Error retrieving file from database.');
    }

    if (result.length === 0) {
      return res.status(404).send('File not found.');
    }

    const fileUrl = result[0].file_url;
    const fileName = fileUrl.split('/').pop(); // Extract the file name from the URL

    // Delete file from S3
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME_1,
      Key: fileName,
    };

    try {
      await s3Client.send(new DeleteObjectCommand(s3Params));

      // Delete the file record from MySQL
      const deleteQuery = 'DELETE FROM files WHERE id = ?';
      db.query(deleteQuery, [fileId], (err, result) => {
        if (err) {
          console.error('Error deleting from MySQL:', err);
          return res.status(500).send('Error deleting file from database.');
        }

        res.status(200).send('File deleted successfully.');
      });
    } catch (error) {
      console.error('Error deleting from S3:', error);
      res.status(500).send('Error deleting file from S3.');
    }
  });
});

// Route to download a file from S3
app.get('/download/:id', (req, res) => {
  const fileId = req.params.id;

  // Fetch the file URL from MySQL to get the file name
  const query = 'SELECT * FROM files WHERE id = ?';
  db.query(query, [fileId], async (err, result) => {
    if (err) {
      console.error('Error retrieving file from database:', err);
      return res.status(500).send('Error retrieving file from database.');
    }

    if (result.length === 0) {
      return res.status(404).send('File not found.');
    }

    const fileUrl = result[0].file_url;
    const fileName = fileUrl.split('/').pop(); // Extract the file name from the URL

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME_1,
      Key: fileName,
    };

    try {
      // Generate a pre-signed URL for downloading
      const command = new GetObjectCommand(s3Params);
      const url = await S3Client.getSignedUrl(command, { expiresIn: 3600 }); // URL valid for 1 hour

      // Redirect to the pre-signed URL
      res.redirect(url);
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      res.status(500).send('Error generating download link.');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

