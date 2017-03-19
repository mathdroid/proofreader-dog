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
        const replyText = `Woof! Hi ${displayName}!\n\nI've read your message:\n\n${text}`
        const replyBalloon = new Messages().addText(replyText)
        const reasons = suggestions.length && suggestions.map(({reason}) => reason).join('\n\n')
        if (reasons) replyBalloon.addSticker({packageId: 1, stickerId: 15}).addText(`My dog-sense 🐕 has some suggestions:\n\n${reasons}`)
        const words = typos.length && typos.map(({word, suggestions}) => `Error on word "${word}". Did you mean ${suggestions.join('/')}?`).join('\n\n')
        if (words) replyBalloon.addSticker({packageId: 1, stickerId: 10}).addText(`🤔🔥 A bit of typographical errors:\n\n${words}`)
        if (!reasons && !words) replyBalloon.addSticker({packageId: 1, stickerId: 14}).addText('Woof woof! I can\'t find any errors! 🐶 Nice job!')
        dog.replyMessage(replyToken, replyBalloon.commit())
    } catch ({message}) {
        console.log(message)
    }
})