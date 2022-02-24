const db = require('../db/mock_db')

//checks if the amount to add to an envelope doesnt exceed the percentage set for that envelope
exports.checkAmountAgainstBudget = (amountToAdd, envelopePercentage, totalBudget) =>{
    const maximumAllowed = envelopePercentage * (totalBudget / 100)
   
    if(amountToAdd <= maximumAllowed) {
        return {
            valid: true,
            maximumAllowed
        }
    }

    return {
        valid: false,
        maximumAllowed
    }   
}

//checks if Total Percentage of all the envelopes doesnt exceed 100%
exports.validateTotalPercentage = (amountToAdd) =>{
    
    const validatePercentage = db.envelopes.reduce((prev, curr) =>{
        
        return +prev + +curr.percentBudget
    },0)

    
    if((+validatePercentage + +amountToAdd) <= 100) {
        return {
            valid: true
        }
    }

    const availablePercentage = 100 - validatePercentage
    return {
        valid: false,
        availablePercentage
    }
}