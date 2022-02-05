import axios from 'axios'
import jsdom, { JSDOM } from 'jsdom'
import fs from 'fs/promises'

const baseURL = 'https://www.guitarcenter.com'
const allowedChars = /[^a-z0-9+]/gi

export async function getResults(config) {
  return doResultsLoop(`${baseURL}${config.category}`, config.searchTerms)
}

async function doResults(url, terms) {
  let next = 1

  let items = {
    matches: [],
    itemIds: []
  }

  do {
    const resp = await axios.get(url)
    const document = JSDOM.fragment(resp.data)
    const matches = Array.from(document.querySelectorAll('div.product'))
      .filter(el => findMatch(el.querySelector('div.productTitle > a'), terms))

    next = document.querySelector('a.page-link.-next')

    items.matches = items.matches.concat(matches.map(el => {
      const link = el.querySelector('div.productTitle > a')
      return {
        imageLink: el.querySelector('img[data-original]').attributes.getNamedItem('data-original').value,
        title: link.innerHTML,
        productLink: baseURL + link.href,
        price: el.querySelector('span.productPrice').innerHTML.match(/[\d,]*\.\d{2}$/)[0].replace(',', ''),
        condition: el.querySelector('div.productCondition').innerHTML,
        itemId: el.querySelector('var.productId').innerHTML
      }
    }))

    items.itemIds = items.itemIds.concat(Array.from(document.querySelectorAll('var.productId')).map(el => el.innerHTML))

    if (next) {
      url = `${baseURL}${next.href}`
    }
  } while (next)

  return items
}

function findMatch(el, terms) {
  const filt = str => str.toLowerCase().replace(allowedChars, '').toLowerCase()
  return terms.reduce((prev, curr) => prev || filt(el.innerHTML).includes(filt(curr)), false)
}
