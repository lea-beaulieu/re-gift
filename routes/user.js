const router = require("express").Router();
const Gift = require("../models/Gift.model.js");

// ########  ########   #######  ######## #### ##       
// ##     ## ##     ## ##     ## ##        ##  ##       
// ##     ## ##     ## ##     ## ##        ##  ##       
// ########  ########  ##     ## ######    ##  ##       
// ##        ##   ##   ##     ## ##        ##  ##       
// ##        ##    ##  ##     ## ##        ##  ##       
// ##        ##     ##  #######  ##       #### ######## 

router.get('/profile', (req, res, next) => {
  if(!req.session.user) {
    res.redirect('/login')
  }
  // READ user's gifts on profile page
  Gift.find({user: req.session.user._id, available : true})
    .then(giftFromDb => {
      res.render('user/myprofile', {
        userInSession: req.session.user,
        giftFromDb: giftFromDb})
    })
    .catch (error => {
      console.log(`error while listing gifts from Db:' ${error}`);
      next(error)
    })
})

module.exports = router;