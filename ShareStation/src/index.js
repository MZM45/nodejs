const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const config = require('./config');
const fs = require('fs');

const app = express();
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));


// Define MongoDB schema and model
const fileSchema = new mongoose.Schema({
    filename: String,
    path: String
});
const File = mongoose.model('File', fileSchema); // Create the File model

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Set up EJS view engine
app.set('view engine', 'ejs');

// Load home page
app.get('/', (req, res) => {
    // Fetch all files from the database
    File.find({})
        .then(files => {
            // Render the home.ejs template with the list of files
            res.render('home', { files: files });
        })
        .catch(err => {
            console.error('Error fetching files:', err);
            res.status(500).send('Internal Server Error');
        });
});;

// Handle file upload
// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        // Read the file content
        const fileData = fs.readFileSync(req.file.path);

        // Create a new File document
        const newFile = new File({
            filename: req.file.filename,
            contentType: req.file.mimetype,
            data: fileData
        });

        // Save the file document to MongoDB
        newFile.save()
            .then(file => {
                // Remove the file from the disk after saving it to MongoDB
                fs.unlinkSync(req.file.path);
                res.send('File uploaded successfully');
            })
            .catch(err => {
                console.error('Error saving file to database:', err);
                res.status(500).send('Internal Server Error');
            });
    } else {
        res.send('No file uploaded');
    }
});


// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Download file
// Download file
// Download file
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', filename); // Adjust the path to point to the uploads directory

    // Check if the file exists
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            console.error('File not found:', err);
            return res.status(404).send('File not found');
        }

        // Send the file for download
        res.download(filePath, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Internal Server Error');
            }
        });
    });
});



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
