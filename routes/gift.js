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
router.get('/add', (req,res) => {
    res.render('gift/new')
})

// traitement formulaire add gift
router.post('/addgift', (req, res) =>{
    const {name, category, brand, description} = req.body;

    Gift.create({name, category, brand, description})
    .then(createdgift =>{
        console.log(`createdgift: ${createdgift}` )
        res.redirect('/monprofil');
    })
    .catch(error => {
        console.log(`error while adding a gift: ${error}`)
        res.render('gift/new',  { errorMessage: 'Error while adding a gift.' })
    })
})


// ########  ######## ########    ###    #### ##        ######  
// ##     ## ##          ##      ## ##    ##  ##       ##    ## 
// ##     ## ##          ##     ##   ##   ##  ##       ##       
// ##     ## ######      ##    ##     ##  ##  ##        ######  
// ##     ## ##          ##    #########  ##  ##             ## 
// ##     ## ##          ##    ##     ##  ##  ##       ##    ## 
// ########  ########    ##    ##     ## #### ########  ######  

router.get('/mygifts/:id', (req,res)=> {
    Gift.findById(req.params.id)
      .then((giftDetails)=>{
          res.render('gift/description', {giftDetails})
      })
      .catch(error => {
        console.log(`error on gift details: ${error}`)
        res.render('user/monprofil',  { errorMessage: 'Error on gift details.' })
    })
})

// ########  ######## ##       ######## ######## ######## 
// ##     ## ##       ##       ##          ##    ##       
// ##     ## ##       ##       ##          ##    ##       
// ##     ## ######   ##       ######      ##    ######   
// ##     ## ##       ##       ##          ##    ##       
// ##     ## ##       ##       ##          ##    ##       
// ########  ######## ######## ########    ##    ######## 

router.post('/mygifts/:id/delete', (req, res)=> {
    Gift.findByIdAndRemove(req.params.id)
      .then((deletedgift) => res.redirect('/monprofil'))
      .catch(error => {
        console.log(`error while deleting a gift: ${error}`)
        res.render('user/monprofil',  { errorMessage: 'Error while deleting a gift.' })
    })
})


module.exports = router;