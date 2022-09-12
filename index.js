// TwitchStreamDataAPI

const fetch = require('node-fetch')
const express = require('express')
const dotenv = require('dotenv')

dotenv.config()
const app = express()
const port = process.env.PORT || 80

app.use(express.static('public'))

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

function sendTwitchRequest() {
    const url = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`

    return fetch(url, {
        method: "POST"
    })
    .then((res) => res.json())
    .then((data) => {
        return data
    })
}

let authorization = ''

async function authTwitch() {
    const authorizationObject = await sendTwitchRequest()
    let { access_token, expires_in, token_type } = authorizationObject
    token_type = token_type.substring(0, 1).toUpperCase() + token_type.substring(1, token_type.length)
    authorization = `${token_type} ${access_token}`
}

app.get('', (req, res) => {
    res.send("Hello world!")
})

app.listen(port, () => {
    console.log(`Twitch Stream Data API running on port ${port}`)
})

module.exports = app