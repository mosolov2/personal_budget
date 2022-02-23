const express = require('express')
const budgetRouter = express.Router()
const db = require('../db/mock_db')
const {postEnvelope ,updateEnvelope, validateEnvelope} = require('../middleware/validate')

//get all envelopes
budgetRouter.get('/', (req, res) => {
    res.send(db)
})

//create envelope
budgetRouter.post('/', validateEnvelope, postEnvelope, (req, res) => {  
       
            const id = Date.now() + Math.random()
            db.envelopes.push({
                id,
                ...req.body
            })
            
            res.status(201).send(db)    
    
})

//create total budget
budgetRouter.post('/total-budget', (req, res) => {
    db.total_budget = req.body.budget
    res.send(db)
})

//update envelope
budgetRouter.put('/:id', validateEnvelope, updateEnvelope, (req, res)=> {
    const envelopeIndex = req.index
    let envelopeId = db.envelopes[envelopeIndex].id
    db.envelopes[envelopeIndex] = {
        id: envelopeId,
        ...req.body
    }
    
   
    res.send(db.envelopes[envelopeIndex])
})



module.exports = budgetRouter