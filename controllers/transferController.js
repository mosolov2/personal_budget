const db = require('../db/mock_db')

exports.getTransfer = (req, res) =>{
    const allEnvelopes = []
    db.envelopes.map(env => {
        return allEnvelopes.push({
            id: env.id,
            title: env.title,
            envelopeAmount: env.envelopeAmount
        })
    })
    res.send(allEnvelopes)
}

exports.transferMoney = (req, res, next) =>{
   
    const amountToBeTransfered = req.body.transferAmount
    const transferIndex = req.transferIndex
    const senderEnvelope = db.envelopes[req.index]
    if (+senderEnvelope.envelopeAmount < +amountToBeTransfered) {
        return res.status(400).send({ error: `There is not enough money in envelope ${senderEnvelope.title} to complete your request. Amount Availabe: ${db.envelopes[req.index].envelopeAmount}` })
    }

    db.envelopes[req.index].envelopeAmount -= +amountToBeTransfered
    db.envelopes[transferIndex].envelopeAmount += +amountToBeTransfered
    res.send( db.envelopes)
}