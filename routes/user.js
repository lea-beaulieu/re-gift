const router = require("express").Router();
const Gift = require("../models/Gift.model.js");

// ########  ########   #######  ######## #### ##       
// ##     ## ##     ## ##     ## ##        ##  ##       
// ##     ## ##     ## ##     ## ##        ##  ##       
// ########  ########  ##     ## ######    ##  ##       
// ##        ##   ##   ##     ## ##        ##  ##       
// ##        ##    ##  ##     ## ##        ##  ##       
// ##        ##     ##  #######  ##       #### ######## 

router.get('/profile', (req, res)=> {
    if(!req.session.user) {
        res.redirect('/login')
    }
    // listing des cadeaux sur le profil de l'user
    Gift.find({user: req.session.user._id})
    .then((giftFromDb) => {
      res.render('user/monprofil', {
        userInSession: req.session.user,
        giftFromDb: giftFromDb})
    })
    .catch (error =>{
      console.log(`error while listing gift from Db:' ${error}`)
    })
    
})

module.exports = router;