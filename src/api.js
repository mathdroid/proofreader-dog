const { create } = require('axios')
const { resolve, reject } = Promise

const api = create({
  baseURL: 'https://micro-write-good-qssvkqadji.now.sh/',
  responseType: 'json',
  timeout: 10000,
})

api.lint = (text) => api.get('/', {params: {text}}).then(({data}) => data).catch(({response: {data}}) => reject(data))

module.exports = exports = api