const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { LoginCollection, CommentCollection } = require('./config');
const path = require("path");
const bcrypt = require('bcrypt');

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
// app.post('/signup', async (req, res) => {
//     const { username, password } = req.body; // Destructure username and password directly
//     try {
//         const existingUser = await LoginCollection.findOne({ name: username }); // Use username instead of name
//         if (existingUser) {
//             return res.status(400).send('User already exists. Please choose a different username.'); // Return status 400 for bad request
//         } else {
//             await LoginCollection.create({ name: username, password }); // Use username instead of name
//             return res.send('Signup Successful!');
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send('Error signing up user'); // Return status 500 for internal server error
//     }
// });



// // Login Route

// app.post('/login', async (req, res) => {
//     const { username, password } = req.body; // Destructure username and password directly
//     try {
//         const user = await LoginCollection.findOne({ name: username });
//         if (user) {
//             // User with the provided username exists, now check if the password matches
//             if (user.password === password) {
//                 const comments = await CommentCollection.find({});
//                 res.render("newsfeed", { username: req.body.username, comments });
//             } else {
//                 res.send('Invalid credentials');
//             }
//         } else {
//             res.send('Invalid credentials');
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error logging in');
//     }
// });
app.post("/signup", async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }

    // Check if the username already exists in the database
    const existingUser = await LoginCollection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the original password with the hashed one

        const userdata = await LoginCollection.insertMany(data);
        res.send("Signup successful");


        console.log(userdata);
    }

});

app.post("/login", async (req, res) => {
    try {
        const check = await LoginCollection.findOne({ name: req.body.username });
        if (!check) {
            return res.send("User name not found");
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            return res.send("Wrong password");
        } else {
            const comments = await CommentCollection.find({});
            return res.render("newsfeed", { username: req.body.username, comments });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error occurred while logging in");
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
