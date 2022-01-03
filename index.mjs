import fs from "fs/promises"

import { getResults } from "./src/crawler/retrieve.mjs";
import { makeHTML } from "./src/util/html.mjs"
import { mailFactory } from "./src/util/factories.mjs";
import configs from "./config/config.mjs"

const mailer = mailFactory()
let history

try {
  history = JSON.parse(await fs.readFile('history.json'))
} catch (e) {
  history = []
}

const results = await Promise.all(configs.searches.map(getResults))

const combined = results.reduce((p, c) => {
  return {
    matches: p.matches.concat(c.matches),
    itemIds: p.itemIds.concat(c.itemIds)
  }
})

const newMatches = combined.matches.filter(item => !history.map(record => record.itemId).includes(item.itemId))
const newHistory = newMatches.concat(history.filter(record => combined.itemIds.includes(record.itemId)))

await fs.writeFile('history.json', JSON.stringify(newHistory, null, '  '))

if (newMatches.length) {
  const html = makeHTML(newMatches)
  sendMail(html)
} else {
  console.log('no new matches')
}

function sendMail(html) {
  mailer.sendMail(configs.emailRecipients, 'New Guitar Center results', null, html)
}