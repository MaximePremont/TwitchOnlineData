// TwitchStreamDataAPI

const fetch = require('node-fetch')
const express = require('express')
const dotenv = require('dotenv')

dotenv.config()
const app = express()
const port = process.env.PORT || 80

app.use(express.static('public'))

app.get('', (req, res) => {
    res.send("Hello world!")
})

app.listen(port, () => {
    console.log(`Twitch Stream Data API running on port ${port}`)
})

module.exports = app;