const express = require('express')
const { append } = require('express/lib/response')
const PORT = 3000 || process.env.PORT

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World')
})


app.listen(PORT, ()=>{
    console.log('process running on port:', PORT)
})