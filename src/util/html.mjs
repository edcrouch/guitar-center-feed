export function makeHTML(results, currencyFormatter) {
  return `<div style="margin: 5px 10px; font-family: 'Cantarell'; padding: 0px;">
  ${results.map(item => makeItemHTML(item, currencyFormatter)).join('')}
  </div>`
}

function makeItemHTML(item, currencyFormatter) {
  return `<div style="overflow: auto; padding: 5px; display: flex; align-items: center;">
  <img style="float:left; height: 200px; width: 200px;"src="${item.imageLink}">
  <ul>
    <h2 style="font-size: 20px;"><a style="margin: 0px;" href="${item.productLink}">${item.title}</a></h2>
    <h3 style="font-size: 20px;">${currencyFormatter(item.price)}</h3>
    <p>${item.condition}</p>
  </ul>
</div>
`
}
