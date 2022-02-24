const db = require('../db/mock_db')

exports.checkIfEnvelopeExists = (req, res, next) => {
    
    const envelopeIndex = db.envelopes.findIndex(env => {

        return env.id === Number(req.params.id)
    })

    if (envelopeIndex === -1) {
        return res.status(404).send(false)
    }    
   
    req.index = envelopeIndex
    next()
}

