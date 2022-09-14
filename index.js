// TwitchStreamDataAPI

const fetch = require('node-fetch')
const express = require('express')
const dotenv = require('dotenv')

dotenv.config()
const app = express()
const port = process.env.PORT || 80

app.use(express.static('public'))

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Headers', '*')
    next()
})

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
    .catch((error) => {
        console.log(`Error: ${error}`)
        return 'undefined'
    })
}

let authorization = 'undefined'

async function authTwitch() {
    const authorizationObject = await sendTwitchRequest()
    if (authorizationObject === 'undefined') {
        authorization = 'undefined'
    } else {
        try {
            let { access_token, expires_in, token_type } = authorizationObject
            token_type = token_type.substring(0, 1).toUpperCase() + token_type.substring(1, token_type.length)
            authorization = `${token_type} ${access_token}`
        } catch (error) {
            console.log(`Error: ${authorizationObject} | ${error}`)
            authorization = 'undefined'
        }
    }
}

app.get('/', async (req, res) => {
    if (req.query.user === undefined) {
        res.send("Error, user undefined.")
    } else {
        await authTwitch()
        if (authorization === 'undefined') {
            res.send("Error, twitch auth failed.")
        } else {
            const endpoint = `https://api.twitch.tv/helix/streams?user_login=${req.query.user}`

            let headers = {
                authorization,
                "Client-Id": clientId
            }
            fetch(endpoint, {
                headers
            })
            .then((res) => res.json())
            .then((data) => {
                res.send(data)
            })
            .catch((error) => {
                console.log(`Error: ${error}`)
                res.send("Error, can't retrieve data from twitch.")
            })
        }
    }
})

app.listen(port, () => {
    console.log(`Twitch Stream Data API running on port ${port}`)
})

module.exports = app