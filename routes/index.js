const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

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
  res.render('user/monprofil', {userInSession: req.session.user})
})

module.exports = router;
