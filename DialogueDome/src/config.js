const mongoose = require('mongoose');

// Connect to the database
mongoose.connect("mongodb://localhost:27017/Website", { 
   
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
