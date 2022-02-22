const express = require('express')
const PORT = 3000 || process.env.PORT

const budgetRouter = require('./routers/budget_router')

const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/envelopes', budgetRouter)


app.listen(PORT, ()=>{
    console.log('process running on port:', PORT)
})