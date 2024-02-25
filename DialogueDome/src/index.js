const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { LoginCollection, CommentCollection } = require('./config');
const path = require("path");

mongoose.connect("mongodb+srv://MZM45:shesha007@dialoguedome.hdmwsjh.mongodb.net/?retryWrites=true&w=majority&appName=DialogueDome", { 
   
})
.then(() => {
    console.log("Database Connected Successfully");
})
.catch((err) => {
    console.error("Error connecting to database:", err);
});

// Create Schema for Login
const loginSchema = new mongoose.Schema({
    username: {
        type: String,
      
    },
    password: {
        type: String,
      
    }
});

// Create Schema for Comments
const commentSchema = new mongoose.Schema({
    commentText: {
        type: String,
       
    },
    username: {
        type: String
       
    }
});

// Create models based on schemas
const LoginCollection = mongoose.model("users", loginSchema);
const CommentCollection = mongoose.model("usercomments", commentSchema);

module.exports = {
    LoginCollection,
    CommentCollection
};

// for CSS

app.use(express.static("public"));

// Set up EJS for rendering views
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Home Route
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/home', (req, res) => {
    res.render('home');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Assuming you're rendering the newsfeed.ejs template in your Express.js route handler
// Update your route handler for /newsfeed to be asynchronous
// Assuming you fetch comments and render newsfeed.ejs in your route handler

// Assuming you fetch comments and render newsfeed.ejs in your route handler
app.get('/newsfeed', async (req, res) => {
    try {
        const comments = await CommentCollection.find({});
        res.render('newsfeed', { comments }); // Pass the comments variable to the template
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching comments');
    }
});




// Signup Route
app.post('/signup', async (req, res) => {
    const { name, password } = req.body;
    try {
        const existingUser = await LoginCollection.findOne({ name });
        if (existingUser) {
            return res.send('User already exists. Please choose a different username.');
        } else {
            await LoginCollection.create({ name, password });
            return res.send('Signup Successful!');
        }
    } catch (error) {
        console.error(error);
        return res.send('Error signing up user');
    }
});


// Login Route

app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await LoginCollection.findOne({ name });
        const pass = await LoginCollection.findOne({password });
        if (user && pass) {
            const comments = await CommentCollection.find({});
            res.render("newsfeed", { username: req.body.username, comments });
        } else {
            res.send('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in');
    }
});
// Add Comment Route
app.post('/add-comment', async (req, res) => {
    const { commentText,username } = req.body;
    try {
        const newComment = await CommentCollection.create({ commentText, username });
        res.send('Comment added successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding comment');
    }
});

// Home Route to display all comments
app.get('/comments', async (req, res) => {
    try {
        const comments = await CommentCollection.find({});
        res.render('comments', { comments });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching comments');
    }
});
// In your index.js file

// Logout Route
app.post('/logout', (req, res) => {
    // Perform any logout cleanup here
    // For example, clear the session if you are using sessions
    
    // Redirect the user to the login page after logout
    res.redirect('/login');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
