const router = require("express").Router();
const Gift = require("../models/Gift.model.js");
const Transaction = require("../models/Transaction.model.js");
const fileUploader = require('../config/cloudinary.config');
const flash = require("express-flash");

// ######  ########  ########    ###    ######## ######## 
// ##    ## ##     ## ##         ## ##      ##    ##       
// ##       ##     ## ##        ##   ##     ##    ##       
// ##       ########  ######   ##     ##    ##    ######   
// ##       ##   ##   ##       #########    ##    ##       
// ##    ## ##    ##  ##       ##     ##    ##    ##       
//  ######  ##     ## ######## ##     ##    ##    ######## 

// Display gift add form
router.get('/mygifts/add', (req, res) => {
  res.render('gift/new', { userInSession: req.session.user })
})

// Gift add form process
router.post('/mygifts/add', fileUploader.single('picture'), (req, res, next) => {
  const { name, category, brand, description, available } = req.body;
  const user = req.session.user;
  console.log('user: ', user);
  
  // //Validation mandatory fields
  if ( !name || !category || !description) {
    res.render('gift/new', {userInSession: user, errorMessage: 'Please enter the gift name, category and description.' });
    return;
  }

  Gift.create({ name, category, brand, description, user, available, picture: req.file.path})
    .then(createdgift => {
        console.log(`createdgift: ${createdgift}`);
        res.redirect('/profile');
    })
    .catch(error => {
        console.log(`error while adding a gift: ${error}`);
        res.render('gift/new', { errorMessage: 'Error while adding a gift.' });
        next(error);
    })
})

// ##     ## ##    ##     ######   #### ######## ########    ########  ######## ########    ###    #### ##        ######  
// ###   ###  ##  ##     ##    ##   ##  ##          ##       ##     ## ##          ##      ## ##    ##  ##       ##    ## 
// #### ####   ####      ##         ##  ##          ##       ##     ## ##          ##     ##   ##   ##  ##       ##       
// ## ### ##    ##       ##   ####  ##  ######      ##       ##     ## ######      ##    ##     ##  ##  ##        ######  
// ##     ##    ##       ##    ##   ##  ##          ##       ##     ## ##          ##    #########  ##  ##             ## 
// ##     ##    ##       ##    ##   ##  ##          ##       ##     ## ##          ##    ##     ##  ##  ##       ##    ## 
// ##     ##    ##        ######   #### ##          ##       ########  ########    ##    ##     ## #### ########  ######  

router.get('/mygifts/:id', (req, res, next) => {
  Gift.findById(req.params.id)
    .then(giftDetails => {
      res.render('gift/description', {
        giftDetails,
        userInSession: req.session.user
      })
    })
    .catch(error => {
      console.log(`error on gift details: ${error}`);
        res.render('user/myprofile', { errorMessage: 'Error on reading gift details.' });
        next(error);
    })
})

// ##     ## ########  ########     ###    ######## ######## 
// ##     ## ##     ## ##     ##   ## ##      ##    ##       
// ##     ## ##     ## ##     ##  ##   ##     ##    ##       
// ##     ## ########  ##     ## ##     ##    ##    ######   
// ##     ## ##        ##     ## #########    ##    ##       
// ##     ## ##        ##     ## ##     ##    ##    ##       
//  #######  ##        ########  ##     ##    ##    ######## 

// Display gift edit form
router.get('/mygifts/:id/edit', fileUploader.single('picture'), (req, res, next) => {
  Gift.findById(req.params.id)
    .then(giftToEdit => {
      const categories = [{name:'books'}, {name:'boxs'} , {name:'fragrances'}, {name:'toys'} ];
      categories.forEach(category => {
        console.log('giftToEdit.category: ', giftToEdit.category)
        console.log('category: ', category)
        console.log('category.name', category.name)
        if (giftToEdit.category === category.name) {
          category.selected = true;
        }
      })
      res.render('gift/edit', {
        giftToEdit,
        categories,
        userInSession: req.session.user
      })
    })
    .catch(error => {
      console.log(`Error during the update of the current gift details: ${error}`);
      res.render('gift/edit', { errorMessage: 'Error while updating the gift details.' });
      next(error);
    })
})


// Gift edit form process
router.post('/mygifts/:id/edit', fileUploader.single('picture'), (req, res, next) => {
  let picture; 
  if (req.file) {
    picture= req.file.path;
  }

  const { name, category, brand, description} = req.body;

  Gift.findByIdAndUpdate(req.params.id, { name, category, brand, description, picture}, { new: true })
    .then(editedgift => {
        console.log(`The edition of the gift ${editedgift} is properly done`)
        res.redirect('/mygifts/' + req.params.id);
    })
    .catch(error => {
        console.log(`error while editing the gift: ${error}`);
        res.render('gift/edit', { errorMessage: 'Error while editing a gift.' });
        next(error);
    })
})

// ######   #### ######## ########  ######      ######     ###    ######## ########  ######    #######  ########  #### ########  ######  
// ##    ##   ##  ##          ##    ##    ##    ##    ##   ## ##      ##    ##       ##    ##  ##     ## ##     ##  ##  ##       ##    ## 
// ##         ##  ##          ##    ##          ##        ##   ##     ##    ##       ##        ##     ## ##     ##  ##  ##       ##       
// ##   ####  ##  ######      ##     ######     ##       ##     ##    ##    ######   ##   #### ##     ## ########   ##  ######    ######  
// ##    ##   ##  ##          ##          ##    ##       #########    ##    ##       ##    ##  ##     ## ##   ##    ##  ##             ## 
// ##    ##   ##  ##          ##    ##    ##    ##    ## ##     ##    ##    ##       ##    ##  ##     ## ##    ##   ##  ##       ##    ## 
//  ######   #### ##          ##     ######      ######  ##     ##    ##    ########  ######    #######  ##     ## #### ########  ######  


router.get('/gifts', (req, res) => {
  res.render('othersgift/gifts', {})
})


// ######   #### ######## ########  ######     ########  ##    ##     ######     ###    ######## ########  ######    #######  ########  ##    ## 
// ##    ##   ##  ##          ##    ##    ##    ##     ##  ##  ##     ##    ##   ## ##      ##    ##       ##    ##  ##     ## ##     ##  ##  ##  
// ##         ##  ##          ##    ##          ##     ##   ####      ##        ##   ##     ##    ##       ##        ##     ## ##     ##   ####   
// ##   ####  ##  ######      ##     ######     ########     ##       ##       ##     ##    ##    ######   ##   #### ##     ## ########     ##    
// ##    ##   ##  ##          ##          ##    ##     ##    ##       ##       #########    ##    ##       ##    ##  ##     ## ##   ##      ##    
// ##    ##   ##  ##          ##    ##    ##    ##     ##    ##       ##    ## ##     ##    ##    ##       ##    ##  ##     ## ##    ##     ##    
//  ######   #### ##          ##     ######     ########     ##        ######  ##     ##    ##    ########  ######    #######  ##     ##    ##    

router.get('/gifts/category', (req, res, next) => {
  console.log('req.query: ', req.query);
  console.log('req.query.name: ', req.query.name);

  Gift.find({ category: req.query.name, available: true})
    .populate('user')
    .then(giftsOfSelectedCategory => {
        console.log('gift: ', giftsOfSelectedCategory)
        res.render('othersgift/giftsbycategory', { category: req.query.name, giftsOfSelectedCategory })
    })
    .catch(error => {
        console.log(`error while looking gifts by category: ${error}`);
        res.redirect('/gifts');
        next(error);
    })
})

// ###        ######   #### ######## ########    ########  ######## ########    ###    #### ##        ######  
// ## ##      ##    ##   ##  ##          ##       ##     ## ##          ##      ## ##    ##  ##       ##    ## 
// ##   ##     ##         ##  ##          ##       ##     ## ##          ##     ##   ##   ##  ##       ##       
// ##     ##    ##   ####  ##  ######      ##       ##     ## ######      ##    ##     ##  ##  ##        ######  
// #########    ##    ##   ##  ##          ##       ##     ## ##          ##    #########  ##  ##             ## 
// ##     ##    ##    ##   ##  ##          ##       ##     ## ##          ##    ##     ##  ##  ##       ##    ## 
// ##     ##     ######   #### ##          ##       ########  ########    ##    ##     ## #### ########  ######  

router.get('/gifts/:id', (req, res, next) => {
  Gift.findById(req.params.id)
    .populate('user')
    .then(giftDetails => {
      Gift.find({ user: req.session.user, available: true})
        .then(giftsFromDb => {
          console.log('my gifts: ', giftsFromDb)
          res.render('othersgift/details', {
            giftDetails,
            giftsFromDb,
            userInSession: req.session.user
          })
        })
    })
    .catch(error => {
      console.log(`error on gift details: ${error}`);
      res.redirect('/gifts/category');
      next(error);
    })
})

// // ########  ######## ##       ######## ######## ######## 
// // ##     ## ##       ##       ##          ##    ##       
// // ##     ## ##       ##       ##          ##    ##       
// // ##     ## ######   ##       ######      ##    ######   
// // ##     ## ##       ##       ##          ##    ##       
// // ##     ## ##       ##       ##          ##    ##       
// // ########  ######## ######## ########    ##    ######## 

// Only possible if gift is avaible and not in an initiated transaction
router.post('/mygifts/:id/delete', (req, res, next) => {
  const user = req.session.user;
  Transaction.find({giftB:req.params.id })
    .then(gifts => {
    console.log('gifts: ', gifts);
      if(gifts.length === 0 ){
        Gift.findByIdAndRemove(req.params.id)
          .then(deleteGift => {
            res.redirect('/profile')
          })
          .catch(error => {
            console.log(error);
            // res.status(401).send
            next(error);
          }) 
      } else {
        req.flash("error", "You cannot delete this gift while it is in a transaction.");
        res.redirect('/profile');
      }
    })
    .catch(error => next(error));
})

module.exports = router;