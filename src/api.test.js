import api from './api'
import test from 'ava'

test('Lint API', async t => {
    const text = 'this sentence was written really carefully to make sure it has no errrors'
    const raw = JSON.parse(JSON.stringify({"text":"this sentence was written really carefully to make sure it has no errrors","suggestions":[{"index":14,"offset":11,"reason":"\"was written\" may be passive voice"},{"index":26,"offset":6,"reason":"\"really\" can weaken meaning"},{"index":33,"offset":9,"reason":"\"carefully\" can weaken meaning"}],"typos":[{"word":"errrors","suggestions":["errors","error","horrors","borrowers","emperors","erosive","aerosol"],"positions":[{"from":66,"to":73,"length":7}]}]}))
    const suggestions = api.lint(text)
    t.deepEqual(await suggestions, raw)
})