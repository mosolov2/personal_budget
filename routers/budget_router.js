const express = require('express')
const budgetRouter = express.Router()
const db = require('../db/mock_db')

budgetRouter.get('/', (req, res) => {
    res.send(db)
})

budgetRouter.post('/', (req, res) => {
    db.envelopes.push(req.body)
    res.send(db)
})

budgetRouter.post('/total-budget', (req, res) => {
    db.total_budget = req.body.budget
    res.send(db)
})

budgetRouter.post('/:amount', (req, res) => {
   
    res.send(req.params.amount)
})

module.exports = budgetRouter