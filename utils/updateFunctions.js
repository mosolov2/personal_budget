const db = require('../db/mock_db')
exports.updateBalance = (action, amount) =>{    
    if(action === 'DEPOSIT'){
        db.balance += +amount
    } else if(action === 'WITHDRAW'){
        db.balance -= +amount
    }
    
}