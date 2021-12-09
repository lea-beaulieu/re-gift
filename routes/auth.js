const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// ######  ####  ######   ##    ## ##     ## ########  
// ##    ##  ##  ##    ##  ###   ## ##     ## ##     ## 
// ##        ##  ##        ####  ## ##     ## ##     ## 
//  ######   ##  ##   #### ## ## ## ##     ## ########  
//       ##  ##  ##    ##  ##  #### ##     ## ##        
// ##    ##  ##  ##    ##  ##   ### ##     ## ##        
//  ######  ####  ######   ##    ##  #######  ## 

//affichage du formulaire de signup
router.get("/signup", (req, res) => {
    res.render("auth/signup");
});

//traitement du formulaire de signup
router.post("/signup", (req, res) => {
    console.log('The form data: ', req.body);
    const {firstname, lastname, username, email, password, city, zip } = req.body;

    //validation tous les champs remplis mais PAS DRY
    if ( !firstname || !lastname || !username )  {
        res
            .status(400)
            .render("auth/signup", { errorMessage: "Merci de renseigner tous les champs." });
            // return empêche la création de l'user en DB
            return;
    } else if (!email || !password || !city){
        res
        .status(400)
        .render("auth/signup", { errorMessage: "Merci de renseigner tous les champs." });
        return; 
    } else if (!zip){
        res
            .status(400)
            .render("auth/signup", { errorMessage: "Merci de renseigner tous les champs." });
            return;
    }

    //   ! This use case is using a regular expression to control for special characters and min length
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

    if (!regex.test(password)) {
      res.status(400).render("auth/signup", {
        errorMessage:
        "Votre mot de passe doit contenir au moins 8 charactères dont 1 chiffre, 1 minuscule et 1 majuscule.",
      });
      return;
    }
    
    //hashing the password
        bcrypt
            .genSalt(saltRounds)
            .then(salt => {
                return bcrypt.hash(password, salt);
            })
            .then((hashedPassword) => {
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
                });
            })
            .then((userFromDB) => {
                console.log('User created:' , userFromDB);
                // Bind the user to the session object
                req.session.user = userFromDB;
                res.redirect("/profile");
                return;
            })
            .catch((error) => {
                console.log('Error while creating user:', error);
                if (error instanceof mongoose.Error.ValidationError) {
                    res
                        .status(400)
                        .render("auth/signup", { errorMessage: error.message });
                } else if (error.code === 11000) {
                    res.status(400).render("auth/signup", {
                        errorMessage: "Ce nom d'utilisateur et/ou cet email sont déjà associés à un compte.",
                    });
                } else {res
                    .status(500)
                    .render("auth/signup", { errorMessage: error.message });
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

//affichage formulaire de login
router.get("/login", (req, res) => {
    res.render("auth/login");
});

//traitement formulaire de login
router.post("/login", (req, res, next) => {
    console.log('SESSION:', req.session);
    const { email, password } = req.body;

    if (!email || !password) {
        res
            .status(400)
            .render("auth/login", { errorMessage: "Merci de renseigner votre email et votre mot de passe."  });
            return;
    }

    // Here we use the same logic as above
    // we check the strength of a password
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    if (!regex.test(password)) {
        res.status(400).render("auth/login", {
          errorMessage:
          "Votre mot de passe doit contenir au moins 8 charactères dont 1 chiffre, 1 minuscule et 1 majuscule."
        });
      }

    // Search the database for a user with the email submitted in the form
    User.findOne({ email })
        .then((user) => {
            // If the user isn't found, send the message that user provided wrong credentials
            if (!user) {
                res
                    .status(400)
                    .render("auth/login", { errorMessage: "Aucun compte n'est associé à cet email." });
                    return;
            }

            // If user is found based on the username, check if the in putted password matches the one saved in the database
            bcrypt.compare(password, user.password).then((isSamePassword) => {
                if (!isSamePassword) {
                    res
                        .status(400)
                        .render("auth/login", { errorMessage: "Mot de passe incorect." });
                        return;
                }
                //save the user in the session
                req.session.user = user;
                // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
                res.redirect("/profile");
                return;
            });
        })

    .catch((err) => {
        // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
        next(err);
        res.status(500).render("login", { errorMessage: err.message });
        return;
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
    req.session.destroy((err) => {
        if (err) {
            res
                .status(500)
                .render("auth/logout", { errorMessage: err.message });
                return;
        }
        res.redirect("/");
    });
});

module.exports = router;