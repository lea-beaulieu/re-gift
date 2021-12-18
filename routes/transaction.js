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
  Transaction.create({
    giftA: req.params.id,
    giftB: req.body.mygifts,
    status: 'initiated',
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
})

// ##       ####  ######  ######## #### ##    ##  ######   
// ##        ##  ##    ##    ##     ##  ###   ## ##    ##  
// ##        ##  ##          ##     ##  ####  ## ##        
// ##        ##   ######     ##     ##  ## ## ## ##   #### 
// ##        ##        ##    ##     ##  ##  #### ##    ##  
// ##        ##  ##    ##    ##     ##  ##   ### ##    ##  
// ######## ####  ######     ##    #### ##    ##  ######   

router.get('/transactionsstatus', (req, res) => {
  Gift.find({ user: req.session.user._id})
    .then(mygifts => {
      var mygiftsIds = [];
        for (let i = 0; i < mygifts.length; i++) {
          mygiftsIds.push(mygifts[i].id);
        }
      console.log('mygifts: ', mygifts)
      console.log('mygiftsIds: ', mygiftsIds)
      Transaction.find({ giftB: { $in: mygiftsIds } })
        .populate('giftA')
        .populate('giftB')
        .then(transactionsIaskedfor => {
          console.log('transactionIaskedfor: ', transactionsIaskedfor)
          Transaction.find({ giftA: { $in: mygiftsIds } })
            .populate('giftA')
            .populate('giftB')
            .then(transactionsIamaskedfor => {
                console.log('transactionIamaskedfor: ', transactionsIamaskedfor)
                res.render('transaction/status', { mygifts, transactionsIaskedfor, transactionsIamaskedfor, userInSession: req.session.user })
            })
        })
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
        }).catch(err => next(err));
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
                userInSession: req.session.user
              })
            }).catch(err => next(err))
        }).catch(err => next(err))
    })
    .catch(error => {
        console.log(`error while updating the transaction status: ${error}`);
        res.render('transaction/edit', { errorMessage: 'Error while editing the transaction status.' });
        next(error);
    })
    
    //CALLBACK HELL
    // Transaction.findByIdAndUpdate(req.params.id, { status: status }, { new: true })
    //     .then(editedstatustransaction => {
    //         Gift.findById(editedstatustransaction.giftB)
    //             .populate('user')
    //             .then(giftproposed => {
    //                 console.log('userToContact: ', giftproposed.user)
    //                 console.log(`The transaction with the new status is: ${editedstatustransaction}.`)
    //                 if (req.body.status === 'accept') {


    //                     Gift.findByIdAndUpdate(editedstatustransaction.giftB, { available: false }, { new: true })
    //                         .then(availableStatus => {
    //                             console.log(`The new status of the gift B is after answer ${availableStatus}`)

    //                             Gift.findByIdAndUpdate(editedstatustransaction.giftA, { available: false }, { new: true })
    //                                 .then(availableStatus => {
    //                                     console.log(`The new status of the gift A is after answer ${availableStatus}`)

    //                                     res.render('transaction/contact', {
    //                                         editedstatustransaction,
    //                                         giftproposed,
    //                                         userInSession: req.session.user
    //                                     })

    //                                 })


    //                         })
    //                 } else {
    //                     res.redirect('/transactionsstatus')
    //                 }
    //             })
    //     })
    //     .catch(error => {
    //         console.log(`error while updating the transaction status: ${error}`)
    //         res.render('transaction/edit', { errorMessage: 'Error while editing the transaction status.' })
    //     })

})
module.exports = router;