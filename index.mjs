import fs from "fs/promises"

import { getResults } from "./src/crawler/retrieve.mjs";
import { makeHTML } from "./src/util/html.mjs"
import { mailFactory, currencyFactory } from "./src/util/factories.mjs";
import configs from "./config/config.mjs"

export default async function main() {
  const mailer = mailFactory()
  const formatter = currencyFactory()
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

  const newMatches = combined.matches.filter(item => !history.map(record => record.itemId).includes(item.itemId)).sort((a, b) => a.price - b.price)
// TODO: why is the not always returning stuff correctly?
//  const newHistory = newMatches.concat(history.filter(record => combined.itemIds.includes(record.itemId)))
  const newHistory = newMatches.concat(history)

  await fs.writeFile('history.json', JSON.stringify(newHistory, null, '  '))

  if (newMatches.length) {
    const html = makeHTML(newMatches, formatter)
    sendMail(mailer, html)
    console.log(new Date().toLocaleString() + ' - ' + newMatches.length + ' new matches')
  } else {
    console.log(new Date().toLocaleString() + ' - no new matches')
  }
}

function sendMail(mailer, html) {
  mailer.sendMail(configs.emailRecipients, 'New Guitar Center results', null, html)
}
