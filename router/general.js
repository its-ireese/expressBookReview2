const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let bookss = Object.values(books);
const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

public_users.post("/books/register", (req,res) => {
    //Write your code here
    const username = req.params.username;
    const password = req.params.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
    //return res.status(300).json({message: "Yet to be implemented"});
  });

// Get the book list available in the shop
public_users.get('/books',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});
// Get the book list with promise
public_users.get("/async/books", function (req, res) {
    const promiseBooks = new Promise(() => {
        res.send(JSON.stringify({ books }));
    });
    promiseBooks.then(() => console.log("Promise has been resolved."))
});

// Get book details based on ISBN
public_users.get('/books/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
 // return res.status(300).json({message: "Yet to be implemented"});
 });
// Get the book by isbn with promise
public_users.get("/async/books/isbn/:isbn", function (req, res) {
    const promiseBooks = new Promise(() => {
        const isbn = req.params.isbn;
        res.send(books[isbn])
    });
    promiseBooks.then(() => console.log("Promise has been resolved."))
});
  

 // Get book details based on author
public_users.get('/books/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let filtered_booksByAuthor = bookss.filter((book) => book.author === author);
  return res.send(filtered_booksByAuthor);
  //return res.status(300).json({message: "Yet to be implemented"});
});
// Get the book by author with promise
public_users.get("/async/books/author/:author", function (req, res) {
    const promiseBooks = new Promise(() => {
        const authorName = req.params.author;
        const allBooks = Object.entries(books);
        const bookReturn = [];

        for (const [key, value] of allBooks) {
            if (value.author === authorName) {
                bookReturn.push(value);
            }
        }
        res.send(bookReturn);
    });
    promiseBooks.then(() => console.log("Promise has been resolved."))
});

// Get books based on title
public_users.get('/books/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let filtered_booksByTitle = bookss.filter((book) => book.title === title);
  res.send(filtered_booksByTitle)
  //return res.status(300).json({message: "Yet to be implemented"});
});
// Get book by title with promise
public_users.get("/async/books/title/:title", function (req, res) {
    const promiseBooks = new Promise(() => {
        const bookTitle = req.params.title;
        const allBooks = Object.entries(books);
        const bookReturn = [];

        for (const [key, value] of allBooks) {
            if (value.title === bookTitle) {
                bookReturn.push(value);
            }
        }
        res.send(bookReturn);
    });
    promiseBooks.then(() => console.log("Promise has been resolved."))
});


//  Get book review
public_users.get('/books/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  res.send(books[isbn].reviews);
 // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
