const html = require('choo/html')

module.exports = (msg) => {

  return html`
    <p class="f5 lh-copy measure-wide">${msg}</p>
  `
}
