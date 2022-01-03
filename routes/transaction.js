const router = require("express").Router();
const Gift = require("../models/Gift.model.js");
const Transaction = require("../models/Transaction.model.js");

// ######  ########  ########    ###    ######## ####  #######  ##    ## 
// ##    ## ##     ## ##         ## ##      ##     ##  ##     ## ###   ## 
// ##       ##     ## ##        ##   ##     ##     ##  ##     ## ####  ## 
// ##       ########  ######   ##     ##    ##     ##  ##     ## ## ## ## 
// ##       ##   ##   ##       #########    ##     ##  ##     ## ##  #### 
// ##    ## ##    ##  ##       ##     ##    ##     ##  ##     ## ##   ### 
//  ######  ##     ## ######## ##     ##    ##    ####  #######  ##    ## 

// Transaction form process
router.post('/gifts/:id', (req, res, next) => {
  console.log('req.body: ', req.body);
  // Only if my gift (giftB) is not already in an other transaction 
  Transaction.find({giftB:req.body.mygifts})
  .then(gifts => {
    console.log('gifts: ', gifts);
    if(gifts.length === 0 ){
      Transaction.create({
        giftA: req.params.id,
        giftB: req.body.mygifts,
        status: 'initiate',
      })
      .then(transaction => {
        console.log('transaction: ', transaction)
        res.redirect('/transactionsstatus')
      })
      .catch(error => {
        console.log(`transaction error: ${error}`);
        res.redirect('/gifts');
        next(error);
      })
    } else {
      req.flash("error", "This gift is already in a transaction. Please choose another one.");
      res.redirect('/gifts/' + req.params.id);
    }
  }).catch(error => next(error))
})

// ##       ####  ######  ######## #### ##    ##  ######   
// ##        ##  ##    ##    ##     ##  ###   ## ##    ##  
// ##        ##  ##          ##     ##  ####  ## ##        
// ##        ##   ######     ##     ##  ## ## ## ##   #### 
// ##        ##        ##    ##     ##  ##  #### ##    ##  
// ##        ##  ##    ##    ##     ##  ##   ### ##    ##  
// ######## ####  ######     ##    #### ##    ##  ######   

router.get('/transactionsstatus', (req, res) => {
  Gift.find({user: req.session.user})
    .then(mygifts => {
      var mygiftsIds = [];
      for (let i =0; i<mygifts.length; i++) {
        mygiftsIds.push(mygifts[i].id);
      }
      console.log('mygifts: ', mygifts)
      console.log('mygiftsIds: ', mygiftsIds)
      Transaction.find({giftB:{ $in: mygiftsIds}, status:{ $eq:'initiate'}})
        .populate('giftA')
        .populate('giftB')
        .then(transactionsIaskedfor=> {
          console.log('transactionIaskedfor: ', transactionsIaskedfor)
          Transaction.find({giftB:{ $in: mygiftsIds}, status:{ $ne:'initiate'}})
            .populate('giftA')
            .populate('giftB')
            .then(answeredtransactionsIaskedfor=> {
              Transaction.find({giftA:{ $in: mygiftsIds}, status:{ $eq:'initiate'}})
              .populate('giftA')
              .populate('giftB')
              .then(transactionsIamaskedfor=> {
                Transaction.find({giftA:{ $in: mygiftsIds}, status:{ $ne:'initiate'}})
                .populate('giftA')
                .populate('giftB')
                .then(transactionsupdated=> {
                  console.log('transactionIamaskedfor: ', transactionsIamaskedfor);
                  res.render('transaction/status', {mygifts, transactionsIaskedfor, answeredtransactionsIaskedfor, transactionsIamaskedfor, transactionsupdated, userInSession: req.session.user }) 
                }).catch(error => next(error));
              }).catch(error => next(error));
          }).catch(error => next(error));
        }).catch(error => next(error));
    })
    .catch(error => {
      console.log(`listing error: ${error}`);
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

// Display transaction update form
router.get('/transaction/:id', (req, res, next) => {
  Transaction.findById(req.params.id)
    .then(transactionsIamaskedfor => {
      Gift.findById(transactionsIamaskedfor.giftB._id)
        .populate('user')
        .then(giftproposed => {
          console.log('userToContact: ', giftproposed.user)
          res.render('transaction/edit', {
            transactionsIamaskedfor,
            giftproposed,
            userInSession: req.session.user
          })
        }).catch(error => next(error));
    })
    .catch(error => {
      console.log(`Error while accessing the transaction to update: ${error}`);
      res.redirect('/transactionsstatus');
      next(error);
    })
})

// Transaction update form process
router.post('/transaction/:id', (req, res, next) => {
  const { status } = req.body;
  console.log(`status :`, status)
  Transaction.findByIdAndUpdate(req.params.id, { status: status }, { new: true })
    .then(editedstatustransaction => {
      if (req.body.status !== 'accept') {
        res.redirect('/transactionsstatus')
        return
      }
      Gift.findByIdAndUpdate(editedstatustransaction.giftB, { available: false }, { new: true })
        .populate('user')
        .then(giftproposed => {
          console.log('userToContact: ', giftproposed.user)
          console.log(`The transaction with the new status is: ${editedstatustransaction}.`)
          Gift.findByIdAndUpdate(editedstatustransaction.giftA, { available: false }, { new: true })
            .then(availableStatus => {
              console.log(`The new status of the gift A is after response : ${availableStatus}`)
              res.render('transaction/contact', {
                editedstatustransaction,
                giftproposed,
                userInSession: req.session.user,
              })
            }).catch(err => next(err))
        }).catch(err => next(err))
    })
    .catch(error => {
      console.log(`error while updating the transaction status: ${error}`);
      res.render('transaction/edit', { errorMessage: 'Error while editing the transaction status.' });
      next(error);
    })
})

module.exports = router;