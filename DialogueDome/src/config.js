const mongoose = require('mongoose');

// Connect to the database
mongoose.connect("mongodb+srv://MZM45:shesha007@dialoguedome.hdmwsjh.mongodb.net/?retryWrites=true&w=majority&appName=DialogueDome", { 
   
})
.then(() => {
    console.log("Database Connected Successfully");
})
.catch((err) => {
    console.error("Error connecting to database:", err);
});

const loginSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
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

