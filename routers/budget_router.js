const express = require('express')
const budgetRouter = express.Router()
const db = require('../db/mock_db')
const validation = require('../utils/validate')

budgetRouter.get('/', (req, res) => {
    res.send(db)
})

budgetRouter.post('/', (req, res) => {
    const id = Date.now() + Math.random()
    db.envelopes.push({
        id,
        ...req.body
    })
    res.status(201).send(db)
})

budgetRouter.post('/total-budget', (req, res) => {
    db.total_budget = req.body.budget
    res.send(db)
})

budgetRouter.post('/:id', (req, res) => {

    const envelopeIndex = db.envelopes.findIndex(env => {      
        
        return env.id === Number(req.params.id)
    })

    
    if (envelopeIndex === -1) {
        return res.status(404).send()
    }

    const envelopePercentage = db.envelopes[envelopeIndex].percentBudget
    const amountToAdd = req.body.addAmount
    const totalBudget = db.total_budget
    const availableAmount = db.envelopes[envelopeIndex].availableAmount
    const isAmountAllowed = validation.checkAmountAgainstBudget(availableAmount, amountToAdd, envelopePercentage, totalBudget)
    if(!isAmountAllowed) {
        
        return res.send(`The maximum allowed is ${envelopePercentage}% of ${totalBudget}`)
    }
    db.envelopes[envelopeIndex].availableAmount += +req.body.addAmount    
    res.send(db.envelopes[envelopeIndex])
})

module.exports = budgetRouter