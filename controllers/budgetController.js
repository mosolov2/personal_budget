const db = require('../db/mock_db')
const { validationResult } = require('express-validator')
const {updateBalance} = require('../utils/updateFunctions')
//get All Envelopes
exports.getEnvelopes = (req, res) => {
    res.send(db)
}

// post total budget
exports.postBudget = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).send({error: errors.array()[0].msg})
    }
    db.total_budget = +req.body.budget
    res.send(db)
}

//post an envelope
exports.postEnvelope = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        return res.status(400).send({error: errors.array()[0].msg})
    }

    const id = Date.now() + Math.random()
    db.envelopes.push({
        id,
        ...req.body
    })
   
    updateBalance('DEPOSIT',req.body.envelopeAmount)

    res.status(201).send(db)


}

//update envelope by id
exports.updateEnvelope = (req, res) => {
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        return res.status(400).send({error: errors.array()[0].msg})
    }
    const envelopeIndex = req.index
    let envelope = db.envelopes[envelopeIndex]   
    let envelopeAmount = db.envelopes[envelopeIndex].envelopeAmount
    db.envelopes[envelopeIndex] = {
        ...envelope,
        ...req.body,
        envelopeAmount,
    }


    res.send(db.envelopes[envelopeIndex])
}

exports.depositToEnvelope = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        return res.status(400).send({error: errors.array()[0].msg})
    }
    const envelopeIndex = req.index
    let envelope = db.envelopes[envelopeIndex]
    let envelopeAmount = +db.envelopes[envelopeIndex].envelopeAmount + +req.body.depositAmount
    db.envelopes[envelopeIndex] = {
        ...envelope,
        envelopeAmount,
    }    
   
    updateBalance('DEPOSIT',req.body.depositAmount)
    res.send(db.envelopes[envelopeIndex])
}

exports.withdrawFromEnvelope = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        return res.status(400).send({error: errors.array()[0].msg})
    }
    const envelopeIndex = req.index
    let envelope = db.envelopes[envelopeIndex]
    if (+db.envelopes[envelopeIndex].envelopeAmount < +req.body.withdrawAmount) {
        return res.status(400).send({ error: `There is not enough money in this envelope to complete your request. Amount Availabe: ${db.envelopes[envelopeIndex].envelopeAmount}` })
    }
    let envelopeAmount = +db.envelopes[envelopeIndex].envelopeAmount - +req.body.withdrawAmount
    db.envelopes[envelopeIndex] = {
        ...envelope,
        envelopeAmount,
    }    
    
    updateBalance('WITHDRAW', req.body.withdrawAmount)

    res.send(db.envelopes[envelopeIndex])
}

//delete envelope by id
exports.deleteEnvelope = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        return res.status(400).send({error: errors.array()[0].msg})
    }

    const envelope = db.envelopes[req.index]   
    const updatedArray = db.envelopes.filter(env => {
        return env.id !== envelope.id
    })

    updateBalance('WITHDRAW', db.envelopes[req.index].envelopeAmount)
    db.envelopes = updatedArray
   
    res.status(204).send()
}

exports.deleteAllEnvelopes = (req, res) => {
    const updatedArray = []


    db.envelopes = updatedArray
    db.balance = 0

    res.status(204).send()
}

