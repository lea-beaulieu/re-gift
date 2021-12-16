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


router.post('/gifts/:id', (req, res) => {
    console.log('req.body: ', req.body);
    Transaction.create({
            giftA: req.params.id,
            giftB: req.body.mygifts,
            statut: 'initiated',
        })
        .then(transaction => {
            console.log('transaction: ', transaction)
            res.redirect('/transactionsstatus')
        })
        .catch(error => {
            console.log(`transaction error: ${error}`)
            res.redirect('/gifts')
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
    Gift.find({user: req.session.user._id})
    .then(mygifts => {
        var mygiftsIds = [];
        for (let i =0; i<mygifts.length; i++) {
            mygiftsIds.push(mygifts[i].id);
        }
        console.log('mygifts: ', mygifts)
        console.log('mygiftsIds: ', mygiftsIds)
        Transaction.find({giftB:{ $in: mygiftsIds}})
        .populate('giftA')
        .populate('giftB')
        .then(transactionsIaskedfor=> {
            console.log('transactionIaskedfor: ', transactionsIaskedfor)
        Transaction.find({giftA:{ $in: mygiftsIds}})
        .populate('giftA')
        .populate('giftB')
        .then(transactionsIamaskedfor=> {
            console.log('transactionIamaskedfor: ', transactionsIamaskedfor)
            res.render('transaction/status', {mygifts, transactionsIaskedfor, transactionsIamaskedfor, userInSession: req.session.user }) 
           })
        }) 
    })
    .catch(error => console.log(error))  
})


// ######## ########  #### ######## 
// ##       ##     ##  ##     ##    
// ##       ##     ##  ##     ##    
// ######   ##     ##  ##     ##    
// ##       ##     ##  ##     ##    
// ##       ##     ##  ##     ##    
// ######## ########  ####    ##    

// Route GET for updating a transaction status
router.get('/transaction/:id', (req, res) => {
    Transaction.findById(req.params.id)
        .then(transactionsIamaskedfor => {
          Gift.findById(transactionsIamaskedfor.giftB._id)
           .populate('user')
           .then(giftproposed => {
             console.log('userToContact: ', giftproposed.user)
              res.render('transaction/edit', { 
                transactionsIamaskedfor,
                giftproposed,
                userInSession: req.session.user})
              })
        })
        .catch(error => {
            console.log(`Error while accessing the transaction to update: ${error}`)
            res.redirect('/transactionsstatus')
        })
    
})


// Route POST for updating a transaction status
router.post('/transaction/:id',(req, res) => {
    const {statut} = req.body;

    Transaction.findByIdAndUpdate(req.params.id, { statut }, { new: true })
        .then(editedstatustransaction => {
            Gift.findById(editedstatustransaction.giftB._id)
           .populate('user')
           .then(giftproposed => {
             console.log('userToContact: ', giftproposed.user)
             console.log(`The transaction with the new status is: ${editedstatustransaction}.`)
              if (req.body.statut === 'accept') {
              res.render('transaction/contact', { 
                editedstatustransaction,
                giftproposed,
                userInSession: req.session.user})
              } else {
              res.redirect('/transactionsstatus')
              }
            })
        })
        .catch(error => {
            console.log(`error while updating the transaction status: ${error}`)
            res.render('transaction/edit', { errorMessage: 'Error while editing the transaction status.' })
        })
    
})
module.exports = router;