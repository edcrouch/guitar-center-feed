import axios from 'axios'
import jsdom, { JSDOM } from 'jsdom'
import fs from 'fs/promises'

const baseURL = 'https://www.guitarcenter.com'
const allowedChars = /[^a-z0-9+]/gi

export async function getResults(config) {
  return doResults(`${baseURL}${config.category}`, config.searchTerms)
}

async function doResults(url, terms) {
  const resp = await axios.get(url)
  const { document } = (new JSDOM(resp.data)).window
  const matches = Array.from(document.querySelectorAll('div.product')).filter(el => findMatch(el.querySelector('div.productTitle > a'), terms))
  const next = document.querySelector('a.page-link.-next')

  const matchJson = matches.map(el => {
    const link = el.querySelector('div.productTitle > a')
    return {
      imageLink: el.querySelector('img[data-original]').attributes.getNamedItem('data-original').value,
      title: link.innerHTML,
      productLink: baseURL + link.href,
      price: el.querySelector('span.productPrice').innerHTML.match(/[\d,]*\.\d{2}$/)[0].replace(',', ''),
      condition: el.querySelector('div.productCondition').innerHTML,
      itemId: el.querySelector('var.productId').innerHTML
    }
  })

  if (next) {
    const results = await doResults(`${baseURL}${next.href}`, terms)
    return {
      matches: matchJson.concat(results.matches),
      itemIds: results.itemIds.concat(Array.from(document.querySelectorAll('var.productId')).map(el => el.innerHTML))
    }
  }

  return {
    matches: matchJson,
    itemIds: Array.from(document.querySelectorAll('var.productId')).map(el => el.innerHTML)
  }
}

function findMatch(el, terms) {
  const filt = str => str.toLowerCase().replace(allowedChars, '').toLowerCase()
  return terms.reduce((prev, curr) => prev || filt(el.innerHTML).includes(filt(curr)), false)
}
