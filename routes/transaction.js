const router = require("express").Router();
const Gift = require("../models/Gift.model.js");
const Transaction = require("../models/Transaction.model.js");

// ######## ########     ###    ##    ##  ######     ###     ######  ######## ####  #######  ##    ##  ######  
//    ##    ##     ##   ## ##   ###   ## ##    ##   ## ##   ##    ##    ##     ##  ##     ## ###   ## ##    ## 
//    ##    ##     ##  ##   ##  ####  ## ##        ##   ##  ##          ##     ##  ##     ## ####  ## ##       
//    ##    ########  ##     ## ## ## ##  ######  ##     ## ##          ##     ##  ##     ## ## ## ##  ######  
//    ##    ##   ##   ######### ##  ####       ## ######### ##          ##     ##  ##     ## ##  ####       ## 
//    ##    ##    ##  ##     ## ##   ### ##    ## ##     ## ##    ##    ##     ##  ##     ## ##   ### ##    ## 
//    ##    ##     ## ##     ## ##    ##  ######  ##     ##  ######     ##    ####  #######  ##    ##  ######  

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

/*
######## ########     ###    ##    ##  ######     ###     ######  ######## ####  #######  ##    ##    ##     ## ########  ########     ###    ######## ######## 
   ##    ##     ##   ## ##   ###   ## ##    ##   ## ##   ##    ##    ##     ##  ##     ## ###   ##    ##     ## ##     ## ##     ##   ## ##      ##    ##       
   ##    ##     ##  ##   ##  ####  ## ##        ##   ##  ##          ##     ##  ##     ## ####  ##    ##     ## ##     ## ##     ##  ##   ##     ##    ##       
   ##    ########  ##     ## ## ## ##  ######  ##     ## ##          ##     ##  ##     ## ## ## ##    ##     ## ########  ##     ## ##     ##    ##    ######   
   ##    ##   ##   ######### ##  ####       ## ######### ##          ##     ##  ##     ## ##  ####    ##     ## ##        ##     ## #########    ##    ##       
   ##    ##    ##  ##     ## ##   ### ##    ## ##     ## ##    ##    ##     ##  ##     ## ##   ###    ##     ## ##        ##     ## ##     ##    ##    ##       
   ##    ##     ## ##     ## ##    ##  ######  ##     ##  ######     ##    ####  #######  ##    ##     #######  ##        ########  ##     ##    ##    ######## 
*/

router.get('/transactionsstatus', (req, res) => {
    Gift.findOne({ user: req.session.user._id })
        .then(mygifts => {
            const mygiftsIds = [mygifts._id];
            console.log('mygifts: ', mygifts)
            console.log('mygftsIds: ', mygiftsIds)
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
                            res.render('user/status', { mygifts, transactionsIaskedfor, transactionsIamaskedfor, userInSession: req.session.user })
                        })
                })
        })
        .catch(error => console.log(error))
})



/*
router.post('/transactionsstatus', (req, res) => {


    const { statut } = req.body;

    Transaction.findByIdAndUpdate(req.params.id, { statut })
        .then(transactionToEdit => {
            console.log(`The edition of the transaction status ${transactionToEdit.id} is properly done`)
            res.redirect('/profile');
        })
        .catch(error => {
            console.log(`error while editing the transaction status ${error}`)
            res.redirect('/transactionsstatus')
        })


})
*/

module.exports = router;