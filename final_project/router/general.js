const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');

async function getBooks() {
    try {
       
        const response = await axios.get('http://localhost:5000/');
        console.log("Books retrieved successfully:");
        console.log(JSON.stringify(response.data, null, 4));
    } catch (error) {
       
        console.error("Error fetching books:", error.message);
    }
}

async function getBookByISBN(isbn) {
    try {
      const response = await axios.get(`http://localhost:3000/isbn/${isbn}`);
      console.log("Book details:", response.data);
    } catch (error) {
      console.error("Error fetching book details:", error.message);
    }
  }

  
async function getBookByAuthor(author) {
    try {
      const response = await axios.get(`http://localhost:3000/author/${author}`);
      console.log("Book details:", response.data);
    } catch (error) {
      console.error("Error fetching book details:", error.message);
    }
  }

  
async function getBookByTitle(title) {
    try {
      const response = await axios.get(`http://localhost:3000/title/${title}`);
      console.log("Book details:", response.data);
    } catch (error) {
      console.error("Error fetching book details:", error.message);
    }
  }




const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
 res.send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
 const isbn = req.params.isbn;
 res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter((book) => book.author === author);

  if (booksByAuthor.length > 0) {
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
   const title = req.params.title;
  const booksByTitle = Object.values(books).filter((book) => book.title === title);

  if (booksByTitle.length > 0) {
    return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   const isbn = req.params.isbn;

 res.send(books[isbn].reviews)
});

module.exports.general = public_users;
