const db = require('../db/mock_db')
const {validationResult} = require('express-validator')
const {postEnvelope ,updateDeleteEnvelope, validateEnvelope} = require('../middleware/validate')
//get All Envelopes
exports.getEnvelopes = (req, res) => {
    res.send(db)
}

// post total budget
exports.postBudget = (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).send(errors.array()[0].msg)
    }
    db.total_budget = +req.body.budget
    res.send(db)
}

//post an envelope
exports.postEnvelope = (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
       
        return res.status(400).send(errors.array()[0].msg)
    }
    
        const id = Date.now() + Math.random()
        db.envelopes.push({
            id,
            ...req.body
        })
        
        res.status(201).send(db)    
   
   
}

//update envelope by id
exports.updateEnvelope = (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
       
        return res.status(400).send(errors.array()[0].msg)
    }
    const envelopeIndex = req.index
    let envelopeId = db.envelopes[envelopeIndex].id
    db.envelopes[envelopeIndex] = {
        id: envelopeId,
        ...req.body    }


    res.send(db.envelopes[envelopeIndex])
}

//delete envelope by id
exports.deleteEnvelope = (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
       
        return res.status(400).send(errors.array()[0].msg)
    }

    const envelope = db.envelopes[req.index]
    const updatedArray = db.envelopes.filter(env => {
        return env.id !== envelope.id
    })

    db.envelopes = updatedArray

    res.status(204).send()
}

exports. deleteAllEnvelopes = (req, res) => {
    const updatedArray = []


    db.envelopes = updatedArray

    res.status(204).send()
}

