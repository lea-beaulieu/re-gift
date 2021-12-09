const router = require("express").Router();
const Gift = require("../models/Gift.model.js");

// ###    ########  ########  
// ## ##   ##     ## ##     ## 
// ##   ##  ##     ## ##     ## 
// ##     ## ##     ## ##     ## 
// ######### ##     ## ##     ## 
// ##     ## ##     ## ##     ## 
// ##     ## ########  ########  

//affichage formulaire add gift
router.get('/mygifts/add', (req, res) => {
    res.render('gift/new', {userInSession: req.session.user})
})

// traitement formulaire add gift
router.post('/mygifts', (req, res) => {
    const { name, category, brand, description } = req.body;

    Gift.create({ name, category, brand, description })
        .then(createdgift => {
            console.log(`createdgift: ${createdgift}`)
            res.redirect('/profile');
        })
        .catch(error => {
            console.log(`error while adding a gift: ${error}`)
            res.render('gift/new', { errorMessage: 'Error while adding a gift.' })
        })
})


// ########  ######## ########    ###    #### ##        ######  
// ##     ## ##          ##      ## ##    ##  ##       ##    ## 
// ##     ## ##          ##     ##   ##   ##  ##       ##       
// ##     ## ######      ##    ##     ##  ##  ##        ######  
// ##     ## ##          ##    #########  ##  ##             ## 
// ##     ## ##          ##    ##     ##  ##  ##       ##    ## 
// ########  ########    ##    ##     ## #### ########  ######  

router.get('/mygifts/:id', (req, res) => {
    Gift.findById(req.params.id)
        .then((giftDetails) => {
            res.render('gift/description', { giftDetails, userInSession: req.session.user})
        })
        .catch(error => {
            console.log(`error on gift details: ${error}`)
            res.render('user/monprofil', { errorMessage: 'Error on gift details.' })
        })
})


/*

 ####### ######  ### ####### 
 #       #     #  #     #    
 #       #     #  #     #    
 #####   #     #  #     #    
 #       #     #  #     #    
 #       #     #  #     #    
 ####### ######  ###    #    
                             
 */


// Route GET for listing the details of an exisiting gift
router.get('/mygifts/:id/edit', (req, res) => {
    Gift.findById(req.params.id)
        .then((giftToEdit) => {
            res.render('gift/edit', { giftToEdit, userInSession: req.session.user })
        })
        .catch(error => {
            console.log(`Error during the update of the current gift details: ${error}`)
            res.render('gift/edit', { errorMessage: 'Error while updating the gift details. Please contact the admin team.' })
        })
})


// Route POST for editing the details of an existing gift listing

router.post('/mygifts/:id/edit', (req, res) => {
    const { name, category, brand, description } = req.body;

    Gift.findByIdAndUpdate(req.params.id, { name, category, brand, description }, { new: true })
        .then(editedgift => {
            console.log(`The edition of the gift ${editedgift.name} is properly done`)
            res.redirect('/mygifts/' + req.params.id);
        })
        .catch(error => {
            console.log(`error while editing the following gift: ${error}`)
            res.render('gift/edit', { errorMessage: 'Error while adding a gift.' })
        })
})

module.exports = router;