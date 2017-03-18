const LineBot = require('node-line-messaging-api')
const {secret, token} = require('../config')
const {lint} = require('./api')

const Messages = LineBot.Messages
const PORT = process.env.PORT || 5050

const dog = new LineBot({
    secret,
    token,
    options: {
        port: PORT,
        tunnel: false,
        verifySignature: true,
        endpoint: '/'
    }
})

dog.on('webhook', ({port, endpoint}) => {
    console.log(`dog is online on http://localhost:${port}${endpoint}`)
})

dog.on('tunnel', ({url}) => {
    console.log(`tunnel to local machine created at ${url}`)
})

dog.on('text', async event => {
    try {
        const {displayName} = await dog.getProfileFromEvent(event)
        const {replyToken, message: {text}} = event
        const {suggestions, typos} = await lint(text)
        const replyText = `${displayName}: ${text}`
        const replyBalloon = new Messages().addText(replyText)
        const reasons = suggestions.length && suggestions.map(({reason}) => reason).join('\n')
        if (reasons) replyBalloon.addText(`Suggestions:\n\n${reasons}`)
        const words = typos.length && typos.map(({word, suggestions}) => `Error on word "${word}". Did you mean ${suggestions.join('/')}?`).join('\n')
        if (words) replyBalloon.addText(`Typos:\n\n${words}`)
        dog.replyMessage(replyToken, replyBalloon.commit())
    } catch ({message}) {
        console.log(message)
    }
})