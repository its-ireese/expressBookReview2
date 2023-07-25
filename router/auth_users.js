const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let validUserName = body.req.username;
let validU = users.filter((user) => {
    return user.username === validUserName
});
    if(validU.length > 0) {
        return false;
    } else{
        return true;
    }

//   if(validUserName.length > 0){
//     res.status('Valide username');
//   }else{
//     res.status('Invalide username');
//   }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 3600 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  //return res.status(300).json({message: "Yet to be implemented"});
}});

regd_users.post("/books/login/", (req,res) => {
    //Write your code here
    const username = req.params.username;
    const password = req.params.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
          data: password
        }, 'access', { expiresIn: 3600 });
        req.session.authorization = {
          accessToken,username
      }
      return res.status(200).send("User successfully logged in");
      } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    
   
    //return res.status(300).json({message: "Yet to be implemented"});
  }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let filtered_book = books[isbn];
  if (filtered_book) {
      let review = req.query.review;
      let reviewer = req.session.authorization['username'];
      if(review) {
          filtered_book['reviews'][reviewer] = review;
          books[isbn] = filtered_book;
      }
      res.send(`The review for the book with ISBN  ${isbn} has been added/updated.`);
  }
  else{
      res.send("Unable to find this ISBN!");
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.query.isbn;
    const book = books[isbn];
    const username = req.session.authenticatedUser;

    for (const user in book){
        if (book) {
            delete book.reviews[username];
            return res.status(200).json(`The review for the book with ISBN  ${isbn} has been deleted.`);
        }
    }
    
    return res.status(404).json({ message: "Invalid ISBN" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
