const db = require('../db/mock_db')
const validation = require('../utils/validate')


exports.validateEnvelope = (req, res, next) => {

    //checks if the total budget is set
    const isTotalBudgetSet = db.total_budget && db.total_budget > 0
    if (!isTotalBudgetSet) {
        return res.status(400).send('Before creating an Envelope is necessary to set a Budget')
    }

    const availableAmount = req.body.availableAmount
    const envelopePercentage = req.body.percentBudget
    const totalBudget = db.total_budget
    
    const isAmountAllowed = validation.checkAmountAgainstBudget(availableAmount, envelopePercentage, totalBudget)
    if (!isAmountAllowed.valid) {

        return res.send(`The maximum allowed for this envelope is ${isAmountAllowed.maximumAllowed} (${envelopePercentage}% of ${totalBudget})`)
    }

    
    const isTotalPercentageValid = validation.validateTotalPercentage(envelopePercentage)
    if (!isTotalPercentageValid) {
        return res.status(400).send('Total percentage cannot exceed 100%')
    }

    next()
}


exports.postEnvelope = (req, res, next) => {
    
    const title = req.body.title
    const envelopePercentage = req.body.percentBudget
    const availableAmount = req.body.availableAmount
    const validateFields = (title && title !== '') && (envelopePercentage && envelopePercentage !== '') && (availableAmount && availableAmount !== '')
    if (!validateFields) {
        return res.status(400).send('All fields are required')
    }       
    next()
}

exports.updateEnvelope = (req, res, next) => {
    
    const envelopeIndex = db.envelopes.findIndex(env => {

        return env.id === Number(req.params.id)
    })

    if (envelopeIndex === -1) {
        return res.status(404).send()
    }    
   
    req.index = envelopeIndex
    next()
}

