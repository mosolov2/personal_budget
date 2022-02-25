const express = require('express')
const transferRouter = express.Router({mergeParams: true})
const transferController = require('../controllers/transferController')
const db = require("../db/mock_db")

transferRouter.param('id', (req, res, next, id)=>{
   
    const envelopeIndex = db.envelopes.findIndex(env => {

        return env.id === +id
    })

    if (envelopeIndex === -1) {
        return res.status(404).send(false)
    }    
    req.transferIndex = envelopeIndex    
    next()
   
})

transferRouter.get('/', transferController.getTransfer)

transferRouter.post('/:id', transferController.transferMoney)

module.exports = transferRouter