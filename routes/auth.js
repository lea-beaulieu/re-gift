const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

//Require cloudinary configuration
const fileUploader = require('../config/cloudinary.config');

// ######  ####  ######   ##    ## ##     ## ########  
// ##    ##  ##  ##    ##  ###   ## ##     ## ##     ## 
// ##        ##  ##        ####  ## ##     ## ##     ## 
//  ######   ##  ##   #### ## ## ## ##     ## ########  
//       ##  ##  ##    ##  ##  #### ##     ## ##        
// ##    ##  ##  ##    ##  ##   ### ##     ## ##        
//  ######  ####  ######   ##    ##  #######  ## 

// Display signup form
router.get("/signup", (req, res) => {
    res.render("auth/signup");
});

// Signup form process
router.post("/signup", fileUploader.single('image'), (req, res, next) => {
  console.log('The form data: ', req.body);
  const {firstname, lastname, username, email, password, city, zip } = req.body;

  // No empty fields validation
  if ( !firstname || !lastname || !username )  {
    res
        .status(400)
        .render("auth/signup", { errorMessage: "Please enter all the fields." });
        return;
    } else if (!email || !password || !city) {
    res
        .status(400)
        .render("auth/signup", { errorMessage: "Please enter all the fields." });
        return; 
    } else if (!zip){
    res
        .status(400)
        .render("auth/signup", { errorMessage: "Please enter all the fields." });
        return;
    }

  // Strong password validation
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    res.status(400).render("auth/signup", {errorMessage:"Your password must have at least 8 characters including 1 number, 1 lowercase and 1 uppercase."});
    return;
  }
    
  // Hashing the password
  bcrypt
    .genSalt(saltRounds)
    .then(salt => {
        return bcrypt.hash(password, salt);
    })
    .then(hashedPassword => {
        console.log(`HashedPassword: ${hashedPassword}`)
        // Create a user and save it in the database
        return User.create({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword,
            city,
            zip, 
            avatar: req.file.path 
        });
    })
    .then(userFromDB => {
        console.log('User created:' , userFromDB);
        // Bind the user to the session object
        req.session.user = userFromDB;
        res.redirect("/profile");
        return;
    })
    .catch(error => {
        console.log('Error while creating user:', error);
        if (error instanceof mongoose.Error.ValidationError) {
          res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        } else if (error.code === 11000) {
            res.status(400).render("auth/signup", {errorMessage: "This username and / or email is already associated with an account.",});
        } else {
            // We are sending the error handling to the error handling middleware that is defined in the error handling file
            next(error);
        }
    });
    
});

// ##        #######   ######   #### ##    ## 
// ##       ##     ## ##    ##   ##  ###   ## 
// ##       ##     ## ##         ##  ####  ## 
// ##       ##     ## ##   ####  ##  ## ## ## 
// ##       ##     ## ##    ##   ##  ##  #### 
// ##       ##     ## ##    ##   ##  ##   ### 
// ########  #######   ######   #### ##    ## 

// Display login form
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// Login form process
router.post("/login", (req, res, next) => {
  console.log('SESSION:', req.session);
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .render("auth/login", { errorMessage: "Please enter your email and your password."  });
    return;
  }

// Strong password validation
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    if (!regex.test(password)) {
      res.status(400).render("auth/login", {errorMessage:"Your password must have at least 8 characters including 1 number, 1 lowercase and 1 uppercase."});
    }

  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .then(user => {
      // If the user isn't found, send the message that user provided wrong email
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "No account associated to that email. Please try another one." });
          return;
        }

      // If user is found based on the email, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
      if (!isSamePassword) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Incorrect password. Please try again." });
          return;
        }
      // Save the user in the session
      req.session.user = user;
      res.redirect("/profile");
      return;
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).render("login", { errorMessage: error.message });
      next(error);
    });
});

// ##        #######   ######    #######  ##     ## ######## 
// ##       ##     ## ##    ##  ##     ## ##     ##    ##    
// ##       ##     ## ##        ##     ## ##     ##    ##    
// ##       ##     ## ##   #### ##     ## ##     ##    ##    
// ##       ##     ## ##    ##  ##     ## ##     ##    ##    
// ##       ##     ## ##    ##  ##     ## ##     ##    ##    
// ########  #######   ######    #######   #######     ##   

router.get("/logout",(req, res) => {
  req.session.destroy(error => {
  if (error) {
    res
      .status(500)
      .render("auth/logout", { errorMessage: error.message });
      return;
  }
  res.redirect("/");
  });
});

module.exports = router;