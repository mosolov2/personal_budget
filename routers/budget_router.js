const express = require('express')
const budgetRouter = express.Router()
const db = require('../db/mock_db')
const controller = require('../controllers/budgetController')
const { check } = require('express-validator')
const validation = require('../utils/validate')

const { checkIfEnvelopeExists } = require('../middleware/validate')

//get all envelopes
budgetRouter.get('/', controller.getEnvelopes)

//create total budget
budgetRouter.post('/total-budget',
    check('budget').trim().not().isEmpty().withMessage('Field cannot be empty').bail()
        .isFloat().withMessage('Please provide a numeric value'),
    controller.postBudget
)

//create an envelope
budgetRouter.post('/',
    check().custom(() => {
        const isTotalBudgetSet = db.total_budget && db.total_budget > 0
        if (!isTotalBudgetSet) {
            throw new Error('Before creating an Envelope is necessary to set a Budget')
        }
        return true
    }),
    check('title').trim().not().isEmpty().withMessage("Field is required")
        .isString().withMessage('Please provide a valid Title'),
    check('percentBudget').trim().not().isEmpty().withMessage("Field is required")
        .isFloat().withMessage('Please provide a numeric value'),
    check('availableAmount').trim().not().isEmpty().withMessage("Field is required")
        .isFloat().withMessage('Please provide a numeric value'),
    check().custom((val, { req }) => {
        const availableAmount = req.body.availableAmount
        const envelopePercentage = req.body.percentBudget
        const totalBudget = db.total_budget

        const isAmountAllowed = validation.checkAmountAgainstBudget(availableAmount, envelopePercentage, totalBudget)
        if (!isAmountAllowed.valid) {

            throw new Error(`The maximum allowed for this envelope is ${isAmountAllowed.maximumAllowed} (${envelopePercentage}% of ${totalBudget})`)

        }
        return true
    }),
    check().custom((val, { req }) => {
        const envelopePercentage = req.body.percentBudget
        const isTotalPercentageValid = validation.validateTotalPercentage(envelopePercentage)
        if (!isTotalPercentageValid.valid) {
            const availablePercentage = isTotalPercentageValid.availablePercentage
            throw new Error(`Total percentage of all envelopes cannot exceed 100%. Available percentage: ${availablePercentage}%`)
        }
        return true
    }),
    controller.postEnvelope
)

//update envelope by id
budgetRouter.put('/:id', checkIfEnvelopeExists,
    check().custom(() => {
        const isTotalBudgetSet = db.total_budget && db.total_budget > 0
        if (!isTotalBudgetSet) {
            throw new Error('Before updating an Envelope is necessary to set a Budget')
        }
        return true
    }),
    check('title').trim().not().isEmpty().withMessage("Field is required")
        .isString().withMessage('Please provide a valid Title'),
    check('percentBudget').trim().not().isEmpty().withMessage("Field is required")
        .isFloat().withMessage('Please provide a numeric value'),
    check('availableAmount').trim().not().isEmpty().withMessage("Field is required")
        .isFloat().withMessage('Please provide a numeric value'),
    check().custom((val, { req }) => {
        const availableAmount = req.body.availableAmount
        const envelopePercentage = req.body.percentBudget
        const totalBudget = db.total_budget

        const isAmountAllowed = validation.checkAmountAgainstBudget(availableAmount, envelopePercentage, totalBudget)
        if (!isAmountAllowed.valid) {

            throw new Error(`The maximum allowed for this envelope is ${isAmountAllowed.maximumAllowed} (${envelopePercentage}% of ${totalBudget})`)

        }
        return true
    }),
    check().custom((val, { req }) => {
        const envelopePercentage = req.body.percentBudget
        const isTotalPercentageValid = validation.validateTotalPercentage(envelopePercentage)
        if (!isTotalPercentageValid.valid) {
            const availablePercentage = isTotalPercentageValid.availablePercentage
            throw new Error(`Total percentage of all envelopes cannot exceed 100%. Available percentage: ${availablePercentage}%`)
        }
        return true
    }),
    controller.updateEnvelope)

//delete envelope by id
budgetRouter.delete('/:id', checkIfEnvelopeExists, controller.deleteEnvelope)

//delete all envelopes
budgetRouter.delete('/', controller.deleteAllEnvelopes)

module.exports = budgetRouter