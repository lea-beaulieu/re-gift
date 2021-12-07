const router = require("express").Router();
const Gift = require("../models/Gift.model.js");

// ########  ########   #######  ######## #### ##       
// ##     ## ##     ## ##     ## ##        ##  ##       
// ##     ## ##     ## ##     ## ##        ##  ##       
// ########  ########  ##     ## ######    ##  ##       
// ##        ##   ##   ##     ## ##        ##  ##       
// ##        ##    ##  ##     ## ##        ##  ##       
// ##        ##     ##  #######  ##       #### ######## 

router.get('/monprofil', (req, res)=> {
    if(!req.session.user) {
        res.redirect('/login')
    }
    // listing des cadeaux sur le profil de l'user
    Gift.find({})
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