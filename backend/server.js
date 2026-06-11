require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

const vesselsRouter = require('./routes/vessels')
const portsRouter = require('./routes/ports')

app.use('/api/vessels', vesselsRouter)
app.use('/api/ports', portsRouter)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

 