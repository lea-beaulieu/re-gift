const router = require("express").Router();
const Gift = require("../models/Gift.model.js");
const Transaction = require("../models/Transaction.model.js");

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
      mygiftsIds = [];
        for (let i =0; i<giftFromDb.length; i++) {
          mygiftsIds.push(giftFromDb[i].id);
        }
        // letting user knows the number of barters waiting for a response
        Transaction.find({giftA:{ $in: mygiftsIds}, status:{ $ne: 'decline'}})
          .populate('giftA')
          .then(transactionsIamaskedfor => {
            console.log('transactionIamaskedfor: ', transactionsIamaskedfor);
            res.render('user/myprofile', {
              userInSession: req.session.user,
              giftFromDb: giftFromDb,
              transactionsIamaskedfor
            })
          }).catch(error => next(error))
      })
      .catch (error =>{
        console.log(`error while listing gift from Db:' ${error}`);
        next(error);
      }) 
})

module.exports = router;