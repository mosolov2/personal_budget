exports.checkAmountAgainstBudget = (existentAmount, amount, percentage, budget) =>{
    const maximumAllowed = percentage * (budget / 100)
    const allowedDepositAmount = existentAmount > amount ? existentAmount + amount : amount + existentAmount
  
    if(allowedDepositAmount <= maximumAllowed) {
        return true
    }

    return false
    
}